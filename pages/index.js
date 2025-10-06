import { useState } from 'react'
import CodeEditor from '../components/CodeEditor'
import OptionsPanel from '../components/OptionsPanel'
import ReportCard from '../components/ReportCard'
import { motion } from 'framer-motion'

export default function Home() {
  const [code, setCode] = useState(`#include <stdio.h>\nint main(){printf("Hello SIH\n");return 0;}`)
  const [options, setOptions] = useState({ level: 'medium', passes: ['string-encrypt'], bogusCount: 10 })
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/obfuscate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ code, options })
      })
      if (!res.ok) throw new Error('Server error')
      const json = await res.json()
      setReport(json)
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.section layout className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <CodeEditor value={code} onChange={setCode} />
          <div className="flex gap-2 mt-4">
            <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90">
              {loading ? 'Obfuscating...' : 'Obfuscate'}
            </button>
            <button onClick={() => { setCode('') }} className="px-4 py-2 border rounded-md">Clear</button>
          </div>
          {error && <div className="mt-3 text-red-500">{error}</div>}
        </div>
      </motion.section>

      <aside className="space-y-4">
        <motion.div layout className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <OptionsPanel options={options} setOptions={setOptions} />
        </motion.div>

        <motion.div layout>
          <ReportCard report={report} />
        </motion.div>
      </aside>
    </div>
  )
}
