// import ThemeToggle from './ThemeToggle'

// export default function Header({ theme, setTheme }) {
//   return (
//     <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">OB</div>
//           <div>
//             <h1 className="text-lg font-semibold">Obfusclang UI</h1>
//             <p className="text-xs text-gray-500 dark:text-gray-400">LLVM-based obfuscation — prototype</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4">
//           <nav className="hidden sm:flex gap-4">
//             <a href="/" className="text-sm hover:underline">Home</a>
//             <a href="/dashboard" className="text-sm hover:underline">Dashboard</a>
//           </nav>
//           <ThemeToggle theme={theme} setTheme={setTheme} />
//         </div>
//       </div>
//     </header>
//   )
// }

import ThemeToggle from './ThemeToggle'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getRole, logout } from '../lib/auth' 
import { LayoutDashboard, Code, LogOut } from 'lucide-react'; // Icons will now work

export default function Header({ theme, setTheme }) {
  const [role, setRole] = useState(null)
  const router = useRouter()

  const navLinkClass = "text-sm hover:text-purple-400 transition duration-150 flex items-center gap-1"; 
  const userEmail = role ? `${role}@obfuscator.com` : ''; 

  useEffect(() => {
    setRole(getRole()) 
  }, [])

  const handleLogout = () => {
    logout()
    setRole(null)
    router.push('/login') 
  }
  
  const NavLinks = () => (
    <nav className="flex items-center gap-6">
      
      {role ? (
        // --- 1. SHOW WHEN LOGGED IN (Logout and links visible) ---
        <>
          {/* Obfuscator Link */}
          <Link href="/home" className={navLinkClass}>
            <Code size={16} /> Obfuscator
          </Link>

          {/* DASHBOARD LINK (Admin Only) */}
          {role === 'admin' && (
            <Link href="/dashboard" className={navLinkClass}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}

          {/* User Email/Role Display */}
          <span className="text-sm text-gray-300">{userEmail}</span>

          {/* LOGOUT BUTTON */}
          <button 
            onClick={handleLogout} 
            className="text-white text-sm px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 font-semibold shadow-md transition duration-150 flex items-center gap-1"
          >
            <LogOut size={16} /> Logout
          </button>
        </>
      ) : (
        // --- 2. SHOW WHEN LOGGED OUT (Sign In) ---
        <Link href="/login" 
          className="text-white text-sm px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold shadow-md"
        >
          Sign In
        </Link>
      )}
    </nav>
  )


  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-purple-600 flex items-center justify-center text-white font-bold">OB</div>
          <div>
            <h1 className="text-lg font-semibold text-white">Obfusclang</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <NavLinks /> 
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  )
}