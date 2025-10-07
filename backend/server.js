// backend/server.js (ESM)
import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

// Helpers for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const JOBS_DIR = path.join(__dirname, 'jobs');
await fs.ensureDir(JOBS_DIR);

// Simple helper: base64 encode a JS string
function b64(s) { return Buffer.from(s, 'utf8').toString('base64'); }

// Simple obfuscation transforms (source-level, demo only)
function obfuscateSource(code, options) {
  const report = { passesApplied: [], stringsEncrypted: 0, bogusFunctionsAdded: 0 };

  let out = code;

  // 1) String encryption: replace "..." with marker "__ENC__<b64>__"
  if ((options?.passes || []).includes('string-encrypt')) {
    out = out.replace(/"([^"]*)"/g, (m, p1) => {
      // do not encrypt empty strings
      if (p1.length === 0) return '""';
      report.stringsEncrypted += 1;
      const enc = b64(p1);
      return `"__ENC__${enc}__"`;
    });
    report.passesApplied.push('string-encrypt');
  }

  // 2) Rename identifiers (naive)
  if ((options?.passes || []).includes('rename-symbols')) {
    const map = {};
    let idCount = 0;
    const skip = new Set([
      'int','return','for','while','if','else','printf','cout','using','namespace','std','include',
      'main','void','char','double','float','long','short','unsigned','signed','extern','static','const',
    ]);
    out = out.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (m) => {
      if (skip.has(m)) return m;
      if (!map[m]) {
        idCount++;
        map[m] = 'v' + (1000 + idCount);
      }
      return map[m];
    });
    report.passesApplied.push('rename-symbols');
  }

  // 3) Bogus function insertion
  const bogusCount = Number(options?.bogusCount || 0);
  if ((options?.passes || []).includes('bogus-insert') && bogusCount > 0) {
    let bogusCode = '\n/* bogus functions inserted (demo) */\n';
    for (let i = 0; i < bogusCount; i++) {
      bogusCode += `static void __bogus${i}(){ volatile int x=${i}; for(int j=0;j<${(i % 3) + 1}; ++j) x += j; }\n`;
    }
    out = bogusCode + '\n' + out;
    report.bogusFunctionsAdded = bogusCount;
    report.passesApplied.push('bogus-insert');
  }

  return { out, report };
}

// Postprocess: convert our "__ENC__{b64}__" markers into runtime decode snippet (C-style)
// For demo, we add a simple decoder and replace straightforward printf("__ENC__...__"); patterns
function finalizeEncryptedStrings(source) {
  if (!source.includes('__ENC__')) return source;

  const decoder = `
/* runtime decoder (demo) */
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

/* Very small helper that prints a decoded base64 marker.
   NOTE: This demo implementation prints a placeholder "[DECODED:<b64>]" rather than
   performing a proper base64 decode for brevity and safety.
*/
static void _decode_and_print(const char* enc_marker) {
    const char *start = strstr(enc_marker, "__ENC__");
    if (!start) { printf("%s", enc_marker); return; }
    start += 7;
    const char *end = strstr(start, "__");
    if (!end) { printf("%s", enc_marker); return; }
    size_t len = end - start;
    char *b64 = (char*)malloc(len + 1);
    memcpy(b64, start, len); b64[len] = 0;
    printf("[DECODED:%s]", b64);
    free(b64);
}
`;

  // Replace occurrences of printf("__ENC__...__"); with _decode_and_print("__ENC__...__");
  // Also handle simple cases like printf("prefix __ENC__...__ suffix"); by leaving them untouched
  let out = source.replace(/printf\s*\(\s*"__ENC__([A-Za-z0-9+/=]*)__"\s*\)\s*;/g, (m, p1) => {
    return `_decode_and_print("__ENC__${p1}__");`;
  });

  // If there are still other "__ENC__" markers embedded in arguments (complex), we leave them as markers;
  // the demo decoder above is intentionally simple.
  return decoder + '\n' + out;
}

// POST /api/obfuscate -> receive JSON { code, options }
app.post('/api/obfuscate', async (req, res) => {
  try {
    const { code, options } = req.body;
    if (!code) return res.status(400).json({ error: 'No code provided' });

    const jobId = uuidv4();
    const jobDir = path.join(JOBS_DIR, jobId);
    await fs.ensureDir(jobDir);

    // save original
    const originalPath = path.join(jobDir, 'original.c');
    await fs.writeFile(originalPath, code, 'utf8');

    // obfuscate
    const { out, report } = obfuscateSource(code, options || {});
    const final = finalizeEncryptedStrings(out);

    // write obfuscated file to out folder
    const outDir = path.join(jobDir, 'out');
    await fs.ensureDir(outDir);
    const obfPath = path.join(outDir, 'obf_app.c');
    await fs.writeFile(obfPath, final, 'utf8');

    // create final report with sizes and other metadata
    const sizeBefore = (await fs.stat(originalPath)).size;
    const sizeAfter = (await fs.stat(obfPath)).size;
    const fullReport = {
      jobId,
      input_files: ['original.c'],
      output_file: { path: obfPath, size_before: sizeBefore, size_after: sizeAfter },
      passes: report.passesApplied.map(name => ({ name })),
      strings_encrypted: report.stringsEncrypted || 0,
      bogus_functions_added: report.bogusFunctionsAdded || 0,
      tests: { functional_test: 'not-run' }
    };

    await fs.writeJson(path.join(outDir, 'report.json'), fullReport, { spaces: 2 });

    // return info and download link
    const downloadUrl = `http://localhost:4000/download/${jobId}`;
    return res.json({ jobId, report: fullReport, downloadUrl });
  } catch (err) {
    console.error('Obfuscate error:', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

// GET /download/:jobId -> serve obf_app.c if exists
app.get('/download/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const file = path.join(JOBS_DIR, jobId, 'out', 'obf_app.c');
    if (!await fs.pathExists(file)) return res.status(404).send('Not found');
    // set a friendly download filename
    const filename = `obf_app_${jobId}.c`;
    res.download(file, filename);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).send('Internal error');
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Demo backend listening on ${port}`));

