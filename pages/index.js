
// import { useEffect } from 'react'
// import { useRouter } from 'next/router'
// import { getRole } from '../lib/auth' 
// // Ensure '../lib/auth' is the correct path to your authentication file

// export default function IndexPage() {
//   const router = useRouter()

//   useEffect(() => {
//     // This runs after the page loads to check the user's role
//     const role = getRole()

//     if (role === 'admin') {
//       router.replace('/dashboard') // Admin goes straight to dashboard
//     } else if (role === 'user') {
//       router.replace('/home') // Regular user goes to home/obfuscator UI
//     } else {
//       // ⚠️ REQUIRED CHANGE: Redirect unauthenticated users to the login page
//       router.replace('/login')
//     }
//   }, [router])

//   // Show a brief loading screen while the routing logic is executed
//   return (
//     <div className="min-h-screen flex items-center justify-center text-xl text-gray-400">
//       Loading...
//     </div>
//   )
// }
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getRole } from '../lib/auth';
import Image from 'next/image';

const buttonClass = "px-6 py-3 rounded-full font-semibold text-lg transition duration-300 transform hover:scale-105 shadow-xl";

export default function IndexPage() {
  const router = useRouter();
  const role = getRole();
  const isLoggedIn = !!role;

  useEffect(() => {
    if (isLoggedIn) {
      router.replace(role === 'admin' ? '/dashboard' : '/home');
    }
  }, [isLoggedIn, role, router]);

  if (isLoggedIn) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-400">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen text-white overflow-hidden relative"> 
      
      {/* Header (Custom Header for Landing Page) */}
      <header className="absolute top-0 left-0 w-full pt-4 pb-2 px-6 z-20">
        <div className="flex justify-between items-center container mx-auto px-6">
          
          {/* Logo/Title Area (Simple) */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-purple-600 flex items-center justify-center font-bold text-white text-sm">OB</div>
            <p className="text-white text-sm">LLVM-based obfuscation — prototype</p>
          </div>
          
          {/* Sign In Button (Right Side) */}
          <Link href="/login" 
            className="text-white text-sm px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold shadow-md"
          >
            Sign In
          </Link>
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="container mx-auto px-6 pt-48 pb-20 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT COLUMN: Text Content and Buttons */}
          <div className="max-w-xl">
            
            {/* Obfusclang UI Title (Prominent) */}
            <div className="flex items-center space-x-4 mb-2">
              <div className="w-14 h-14 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-2xl">OB</div>
              {/* ⚠️ FIX: Applied custom class to force large size */}
              <h1 className="title-lg font-extrabold text-white">Obfusclang UI</h1> 
            </div>
            
            <p className="text-2xl text-purple-300 mb-12">LLVM-based obfuscation — prototype</p> 
            
            {/* UNLOCK CODE SECURITY - CRITICAL STYLING */}
            {/* ⚠️ FIX: Applied custom class for glow and massive size */}
            <h2 
              className="glow-title" 
            >
              UNLOCK CODE SECURITY
            </h2>
            
            <p className="text-xl max-w-lg text-gray-400 mb-12">
              Advanced LLVM-based obfuscation for robust software protection.
            </p>
            
            {/* Buttons */}
            <div className="flex space-x-6">
              <button
                className={`${buttonClass} bg-gradient-to-r from-pink-500 to-purple-600 text-white`}
              >
                Learn More
              </button>
              
              <Link href="/login"
                className={`${buttonClass} bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center justify-center`}
              >
                Try Now
              </Link>
            </div>
          </div>
          
          {/* RIGHT COLUMN: The Image */}
          <div className="flex justify-center lg:justify-end h-full">
            <Image 
              src="/backgorund.jpg" // Ensure this is the correct path to your image
              alt="Futuristic glowing chip and circuit board"
              width={750} 
              height={750} 
              objectFit="contain"
              className="max-w-full h-auto opacity-90"
            />
          </div>
        </div>
      </div>

      {/* Footer (Absolute Positioning) */}
      <footer className="absolute bottom-0 w-full p-4 text-gray-500 text-xs z-10">
        <div className="container mx-auto flex justify-center items-center space-x-6">
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
          <p>Contact Us</p>
        </div>
      </footer>
    </div>
  );
}
