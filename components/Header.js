import ThemeToggle from './ThemeToggle'

export default function Header({ theme, setTheme }) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">OB</div>
          <div>
            <h1 className="text-lg font-semibold">Obfusclang UI</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">LLVM-based obfuscation — prototype</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex gap-4">
            <a href="/" className="text-sm hover:underline">Home</a>
            <a href="/dashboard" className="text-sm hover:underline">Dashboard</a>
          </nav>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  )
}
