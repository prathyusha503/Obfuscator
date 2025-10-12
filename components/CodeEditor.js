export default function CodeEditor({ value, onChange }) {
  return (
    <div>
      {/* Removed existing label to match the new Card structure */}
      <textarea
        aria-label="source-code"
        // MODIFIED STYLES: Set a defined height, dark background, and purple focus border
        className="w-full h-72 p-4 text-white bg-gray-900 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
