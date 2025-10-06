export default function CodeEditor({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Source Code</label>
      <textarea
        aria-label="source-code"
        className="codebox w-full h-48 resize-y"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
