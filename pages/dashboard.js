// export default function Dashboard() {
//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
//       <p className="text-sm text-gray-600 dark:text-gray-300">This page can show past obfuscation jobs, logs, and metrics. It's a stub for now.</p>
//     </div>
//   )
// }
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAdmin } from '../lib/auth';
import { LayoutDashboard, History, Zap, HardDrive, Trash2, X, Lock } from 'lucide-react'; // Added X and Lock icons

// --- Mock Data (for history and metrics) ---
const mockHistory = [
    { 
        id: 1, 
        timestamp: new Date().toISOString(), 
        originalSize: 47, 
        obfuscatedSize: 64, 
        passesCount: 3, 
        options: ['String', 'Control'],
        encryptedCode: 'I2luY2x1ZGU8c3RkaW8uaD4Kdm9pZCBtYWluKCl7CnByaW50ZigiSGVsbG8hIik7Cn0=', // Base64 for a simple 'Hello' C program
    },
    { 
        id: 2, 
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), 
        originalSize: 120, 
        obfuscatedSize: 155, 
        passesCount: 5, 
        options: ['Bogus', 'Rename'],
        encryptedCode: 'Y29uc29sZS5sb2coIkRlY3J5cHRpb24gV29ya3MiKTs=' // Base64 for console.log("Decryption Works")
    },
];

// --- Utility Components for Dashboard Design (StatCard is unchanged) ---
const StatCard = ({ title, value, icon, iconColor }) => (
    <div className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
            <h4 className="text-sm font-medium text-gray-400">{title}</h4>
            <div className={`text-${iconColor}-400`}>{icon}</div>
        </div>
        <p className="text-3xl font-extrabold text-white mt-2">{value}</p>
    </div>
);


export default function Dashboard() {
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // ⚠️ MODAL STATE: State to control the visibility and content of the decryption modal
    const [modalVisible, setModalVisible] = useState(false);
    const [decryptedCode, setDecryptedCode] = useState('');


    // 1. Authentication and Data Fetching (Unchanged)
    useEffect(() => {
        if (!isAdmin()) {
            router.replace('/'); 
            return;
        }
        
        setHistory(mockHistory);
        setLoading(false);
    }, [router]);

    // 2. Metrics Calculation (Unchanged)
    const totalOperations = history.length;
    const totalCodeSize = history.reduce((sum, job) => sum + job.obfuscatedSize, 0);
    const totalPasses = history.reduce((sum, job) => sum + job.passesCount, 0);
    const avgPasses = totalOperations > 0 ? (totalPasses / totalOperations).toFixed(1) : '0.0';

    // 3. Decryption Logic (MODIFIED)
    const handleDecryption = (encryptedCode) => {
        try {
            const buffer = Buffer.from(encryptedCode, 'base64');
            const code = buffer.toString('utf8');
            
            // ⚠️ FIX: Set state and open the modal instead of using alert()
            setDecryptedCode(code);
            setModalVisible(true);
            
        } catch (error) {
            alert("Error during decryption simulation.");
            console.error("Decryption error:", error);
        }
    };

    // 4. Clear History Logic (Simulated - Unchanged)
    const handleClearHistory = () => {
        if (confirm("Are you sure you want to clear all obfuscation history?")) {
            setHistory([]);
            alert("History cleared successfully (simulated).");
        }
    };

    // 5. Loading/Access Check (Unchanged)
    if (loading || !isAdmin()) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl text-gray-400">
                Loading Admin Dashboard...
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-900 min-h-screen">
            <div className="container mx-auto">
                
                {/* Dashboard Title and Clear Button (Unchanged) */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-purple-400 mb-1">Admin Dashboard</h1>
                        <p className="text-md text-gray-400">View and manage obfuscation history</p>
                    </div>
                    <button
                        onClick={handleClearHistory}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition duration-200 shadow-md"
                    >
                        <Trash2 size={16} /> Clear History
                    </button>
                </div>

                {/* 1. Metrics Cards (Unchanged) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard title="Total Operations" value={totalOperations} icon={<History size={24} />} iconColor="purple" />
                    <StatCard title="Total Code Size" value={`${totalCodeSize} bytes`} icon={<HardDrive size={24} />} iconColor="purple" />
                    <StatCard title="Avg Passes" value={avgPasses} icon={<Zap size={24} />} iconColor="purple" />
                </div>

                {/* 2. Obfuscation History Table (Unchanged) */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-t-4 border-purple-600/50">
                    <div className="flex items-center mb-6 border-b border-gray-700 pb-3">
                        <History size={24} className="text-purple-400 mr-3" />
                        <div>
                            <h3 className="text-xl font-semibold text-white">Obfuscation History</h3>
                            <p className="text-sm text-gray-400">All code obfuscation operations</p>
                        </div>
                    </div>

                    {/* Table Structure (Unchanged) */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                                <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    <th scope="col" className="px-3 py-3">Timestamp</th>
                                    <th scope="col" className="px-3 py-3">Original Size</th>
                                    <th scope="col" className="px-3 py-3">Obfuscated Size</th>
                                    <th scope="col" className="px-3 py-3">Passes</th>
                                    <th scope="col" className="px-3 py-3">Options</th>
                                    <th scope="col" className="px-3 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700 text-sm">
                                {history.map((job) => (
                                    <tr key={job.id} className="text-white hover:bg-gray-700/50">
                                        <td className="px-3 py-4 whitespace-nowrap flex items-center gap-2">
                                            <LayoutDashboard size={16} className="text-gray-500" />
                                            {new Date(job.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">{job.originalSize} bytes</td>
                                        <td className="px-3 py-4 whitespace-nowrap">{job.obfuscatedSize} bytes</td>
                                        <td className="px-3 py-4 whitespace-nowrap">{job.passesCount}</td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            {job.options.map(opt => (
                                                <span key={opt} className="inline-block bg-purple-500/20 text-purple-300 text-xs font-semibold px-2 py-0.5 rounded-full mr-1">
                                                    {opt}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleDecryption(job.encryptedCode)}
                                                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-lg transition duration-150"
                                            >
                                                Decrypt
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {totalOperations === 0 && (
                            <p className="text-center py-8 text-gray-500">No obfuscation history found.</p>
                        )}
                    </div>
                </div>

            </div>

            {/* ⚠️ MODAL COMPONENT (Decrypted Source Code Viewer) */}
            {modalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-2xl border border-purple-500/50">
                        
                        {/* Modal Header */}
                        <div className="flex justify-between items-center pb-4 border-b border-gray-700 mb-4">
                            <div className="flex items-center gap-3">
                                <Lock size={24} className="text-purple-400" />
                                <h3 className="text-xl font-bold text-white">Decrypted Source Code</h3>
                            </div>
                            <button onClick={() => setModalVisible(false)} className="text-gray-400 hover:text-white transition">
                                <X size={24} className="text-purple-400 hover:text-white bg-purple-800/20 rounded-full p-0.5" />
                            </button>
                        </div>
                        
                        {/* Subtitle */}
                        <p className="text-sm text-gray-400 mb-4">Original source code before obfuscation</p>

                        {/* Code Block */}
                        <div className="bg-gray-950 p-4 rounded-lg border border-gray-700 max-h-96 overflow-auto">
                            <pre className="text-sm text-green-300 font-mono whitespace-pre-wrap">
                                {decryptedCode}
                            </pre>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}