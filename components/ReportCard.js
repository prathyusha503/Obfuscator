export default function ReportCard({ report }) {
  if (!report) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
      <h3 className="font-semibold">Obfuscation Report</h3>
      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-2">
        <div><strong>Output Path:</strong> {report.output_file.path}</div>
        <div><strong>Size (before):</strong> {report.output_file.size_before} bytes</div>
        <div><strong>Size (after):</strong> {report.output_file.size_after} bytes</div>
        <div><strong>Passes:</strong> {report.passes.map(p => p.name).join(', ')}</div>
        <div><strong>Strings encrypted:</strong> {report.passes.reduce((acc,p)=>acc+(p.strings_encrypted||0),0)}</div>
        <div><strong>Functional test:</strong> {report.tests.functional_test}</div>
      </div>
    </div>
  )
}
