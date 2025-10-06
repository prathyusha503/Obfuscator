export default function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      aria-label="Toggle theme"
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
