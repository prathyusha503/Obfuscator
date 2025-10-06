import Header from './Header'

export default function Layout({ children, theme, setTheme }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} setTheme={setTheme} />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="text-center py-4 text-sm text-gray-500">
        Built for SIH — LLVM Obfuscator Prototype
      </footer>
    </div>
  )
}
