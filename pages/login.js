import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// Import all necessary functions from the updated lib/auth.js
import { getRole, login, registerUser, validateCredentials } from '../lib/auth'; 

export default function LoginPage() {
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const router = useRouter();

    // 1. Prevent logged-in users from seeing this page
    useEffect(() => {
        if (getRole()) {
            const role = getRole();
            // Redirect already authenticated users to their respective page
            router.replace(role === 'admin' ? '/dashboard' : '/home');
        }
    }, [router]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic input validation
        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        let roleToAssign = null;
        
        if (isSigningUp) {
            // --- SIGN UP LOGIC ---
            const result = registerUser(username, password);
            if (result.success) {
                roleToAssign = 'user'; 
            } else {
                alert(result.message);
                return;
            }
        } else {
            // --- SIGN IN LOGIC ---
            const result = validateCredentials(username, password);
            if (result.success) {
                roleToAssign = result.role; // Get role ('admin' or 'user')
            } else {
                alert(result.message); // Show error for invalid login
                return;
            }
        }
        
        // Final Redirection
        if (roleToAssign) {
            login(roleToAssign); // Set the role
            // Redirect based on the assigned role
            router.push(roleToAssign === 'admin' ? '/dashboard' : '/home'); 
        }
    };

    const toggleMode = () => {
        setIsSigningUp(!isSigningUp);
        setUsername('');
        setPassword('');
    };
    
    // --- Combined Tailwind and Custom Classes for Styling ---
    // ⚠️ CRITICAL FIX: Ensure the new class is referenced here 
    const containerClass = `w-full max-w-sm p-8 rounded-xl bg-gray-900 mx-auto my-6 ${'login-box-glow'}`; 
    const inputClass = `w-full p-4 mb-5 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 outline-none ${'login-input'}`;
    const buttonClass = `w-full py-4 text-xl font-bold text-white rounded-xl ${'login-button-animated'}`;

    return (
        // The overall dark background is set in globals.css
        <div 
            className="min-h-screen flex items-start justify-center pt-24" 
            style={{
                backgroundColor: '#0a0a2a', 
                // Subtle, multi-layered radial gradients for a star/particle effect (Attractive Background)
                backgroundImage: `
                    radial-gradient(circle at 10% 10%, rgba(139, 92, 246, 0.08) 0%, transparent 5%), 
                    radial-gradient(circle at 90% 90%, rgba(59, 130, 246, 0.06) 0%, transparent 8%),
                    radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.02) 0%, transparent 2%)
                `,
                backgroundBlendMode: 'screen',
            }}
        >
            <div className={containerClass}>
                <h1 className="text-4xl font-extrabold text-center mb-10 text-white">
                    {isSigningUp ? 'Sign Up' : 'Login'}
                </h1>
                
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username" className="text-gray-300 text-sm block mb-1">Username</label> 
                    <input 
                        type="text" 
                        id="username"
                        placeholder="E-mail or Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        className={inputClass} 
                        required
                    />
                    
                    <label htmlFor="password" className="text-gray-300 text-sm block mb-1">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClass} 
                        required
                    />
                    
                    {!isSigningUp && (
                        <p className="text-sm text-right mb-6">
                            <a href="#" className="text-blue-400 hover:underline">Forgot Password ?</a>
                        </p>
                    )}

                    <button 
                        type="submit"
                        className={buttonClass} 
                    >
                        {isSigningUp ? 'Sign up' : 'Sign in'}
                    </button>
                </form>

                {/* Social Sign-in Icons */}
                <p className="text-center text-gray-400 text-sm mt-8 mb-4">
                    Login with social accounts
                </p>
                <div className="flex justify-center space-x-6 mb-8">
                    {['G', 'T', 'H'].map((icon, index) => (
                        <div 
                            key={index} 
                            className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer ${'social-button-animated'}`}
                        >
                            <span className="text-white text-xl font-bold">{icon}</span>
                        </div>
                    ))}
                </div>

                <p className="text-center text-sm text-gray-400">
                    {isSigningUp ? 'Already have an account? ' : "Don't have an account? "}
                    <button onClick={toggleMode} className="text-white font-semibold hover:underline">
                        Sign {isSigningUp ? 'In' : 'up'}
                    </button>
                </p>
            </div>
        </div>
    );
}