// Demo mock API that simulates a backend obfuscation run and returns a report.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { code, options } = req.body

  if (!code) return res.status(400).json({ error: 'No code provided' })

  await new Promise(r => setTimeout(r, 1000))

  const sizeBefore = Buffer.byteLength(code, 'utf8')
  const bogusAdded = options.bogusCount || 0
  const passes = (options.passes || []).map(p => ({ name: p, strings_encrypted: p === 'string-encrypt' ? (code.includes('"') ? 1 : 0) : 0 }))

  const sizeAfter = sizeBefore + bogusAdded * 32 + passes.reduce((a,b)=>a+(b.strings_encrypted||0)*20,0)

  const report = {
    input_files: ['stdin'],
    cli_args: `--passes=${(options.passes||[]).join(',')} --level=${options.level}`,
    output_file: { path: '/build/obf_app', size_before: sizeBefore, size_after: sizeAfter, sha256: 'demo-sha256-123' },
    passes,
    stats: { bogus_functions_added: bogusAdded, obfuscation_cycles: 1 },
    tests: { functional_test: 'pass' }
  }

  return res.status(200).json(report)
}
