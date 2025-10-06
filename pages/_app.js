import '../styles/globals.css'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored) setTheme(stored)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <Layout theme={theme} setTheme={setTheme}>
      <Component {...pageProps} />
    </Layout>
  )
}
