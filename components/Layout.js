// import Header from './Header'

// export default function Layout({ children, theme, setTheme }) {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header theme={theme} setTheme={setTheme} />
//       <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {children}
//       </main>
//     </div>
//   )
// }

import Header from './Header'
import { useRouter } from 'next/router' 

export default function Layout({ children, theme, setTheme }) {
  const router = useRouter()
  
  // Check if the current path is the landing page or the login page
  const isLandingPage = router.pathname === '/' 
  const isLoginPage = router.pathname === '/login' // 👈 Check for login page

  // Conditionally set the main class
  const mainClass = isLandingPage 
    ? "flex-1 w-full p-0" // Landing page fills the screen
    : "flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4" // Standard page padding
  
  // ⚠️ CRITICAL FIX: Hide the standard header on both the landing and login pages
  const hideHeader = isLandingPage || isLoginPage // 👈 Updated logic

  return (
    // Set a deep background class on the top-level div for consistency
    <div className={`min-h-screen flex flex-col ${isLandingPage ? 'bg-[#0a0a2a]' : 'bg-gray-950'}`}>
      
      {/* Conditionally render the header */}
      {!hideHeader && <Header theme={theme} setTheme={setTheme} />}
      
      <main className={mainClass}>
        {children}
      </main>
    </div>
  )
}