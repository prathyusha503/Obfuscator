import { useState } from 'react'
import CodeEditor from '../components/CodeEditor'
import OptionsPanel from '../components/OptionsPanel'
import ReportCard from '../components/ReportCard'
import { motion } from 'framer-motion'

export default function Home() {
  const [code, setCode] = useState(`#include <stdio.h>\nint main(){printf("Hello SIH\\n");return 0;}`)
  const [options, setOptions] = useState({ level: 'medium', passes: [], bogusCount: 10 })
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit() {
    setError(null)
    setLoading(true)
    setReport(null)
    setDownloadUrl(null)

    try {
      const res = await fetch('http://localhost:4000/api/obfuscate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ code, options })
      })

      // try to parse JSON body (error details may be inside)
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        // if server returned JSON with message, show it; otherwise show status
        const msg = (json && (json.error || json.message)) ? (json.error || json.message) : `Server error ${res.status}`
        throw new Error(msg)
      }

      // expected response: { jobId, report, downloadUrl }
      setReport(json.report || null)
      setDownloadUrl(json.downloadUrl || null)
    } catch (e) {
      setError(e.message || 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <motion.section layout className="lg:col-span-2">
    <div className="code-card shadow-xl transition-transform hover:scale-[1.01]">
      <CodeEditor value={code} onChange={setCode} />
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
        >
          {loading ? 'Obfuscating...' : 'Obfuscate'}
        </button>
        <button
          onClick={() => setCode('')}
          className="px-4 py-2 border rounded-md"
        >
          Clear
        </button>
      </div>
      {error && <div className="mt-3 text-red-500">{error}</div>}
    </div>
  </motion.section>

      <aside className="space-y-4">
        <motion.div layout className="code-card shadow-xl transition-transform hover:scale-[1.01]">
          <OptionsPanel options={options} setOptions={setOptions} />
        </motion.div>

        <motion.div layout className="code-card shadow-xl transition-transform hover:scale-[1.01]">
          <ReportCard report={report} />
          {downloadUrl && (
    <div className="mt-3">
      <a
        href={downloadUrl}
        download // hint to browser to download instead of navigate
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download obfuscated file"
        className="button inline-flex items-center" // `button` is the custom CSS class, keep extra Tailwind classes if needed
      >
        {/* decorative spinning stripe behind */}
        <div className="dots_border" aria-hidden="true"></div>

        {/* sparkle icon (SVG). Adjust the path if you want a different icon */}
        <svg
          className="sparkle"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          aria-hidden="true"
        >
          <path className="path" d="M12 2v20M5 15l7 7 7-7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path className="path" d="M12 6l1.5 3 3 1.5-3 1.5L12 15l-1.5-3L7 10.5l3-1.5L12 6z" fill="currentColor" />
        </svg>

        {/* visible button text (styled by .text_button) */}
        <span className="text_button">Download</span>
      </a>
    </div>
    )}

        </motion.div>
      </aside>
    </div>
  )
}

