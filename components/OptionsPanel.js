export default function OptionsPanel({ options, setOptions }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Obfuscation Level</label>
        <select value={options.level} onChange={e => setOptions({...options, level: e.target.value})} className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Passes</label>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {['string-encrypt','rename-symbols','bogus-insert','cfg-flatten'].map(p => (
      <label key={p} className="inline-flex items-center gap-2">
              <input type="checkbox" checked={options.passes.includes(p)} onChange={e => {
                const checked = e.target.checked
                setOptions(prev => ({
                  ...prev,
                  passes: checked ? [...prev.passes, p] : prev.passes.filter(x => x !== p)
                }))
              }} />
              <span className="text-sm">{p}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Bogus code count</label>
        <input type="number" value={options.bogusCount} min={0} max={500} onChange={e => setOptions({...options, bogusCount: Number(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2" />
      </div>

    </div>
  )
}
