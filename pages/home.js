import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import CodeEditor from '../components/CodeEditor'
import OptionsPanel from '../components/OptionsPanel'
import ReportCard from '../components/ReportCard'
import { getRole } from '../lib/auth' 
import { RefreshCw, Code, Zap, FileText } from 'lucide-react';

// --- Utility Components for Styling Consistency (Card is unchanged) ---
const Card = ({ title, subtitle, icon, children }) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-t-4 border-purple-600/50">
        <div className="flex items-center mb-4 border-b border-gray-700 pb-3">
            <div className="text-purple-400 mr-3">{icon}</div>
            <div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="text-sm text-gray-400">{subtitle}</p>
            </div>
        </div>
        {children}
    </div>
);

// --- Main Page Component ---

export default function HomePage() {
  const router = useRouter()
  const [loadingAuth, setLoadingAuth] = useState(true)

  // 1. Authentication Check & Admin Redirect (Unchanged)
  useEffect(() => {
    const userRole = getRole()
    
    if (userRole === 'admin') {
      router.replace('/dashboard')
    }
    setLoadingAuth(false)
  }, [router])

  // 2. Obfuscator State & Logic 
  const [code, setCode] = useState(`#include <stdio.h>\nint main(){printf("Enter your source code here...");return 0;}`)
  const [options, setOptions] = useState({ 
      bogusCount: 3, 
      passes: ['string-encrypt', 'cfg-flatten']
  }) 
  
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [error, setError] = useState(null)

  // Simulate API Submission 
  async function handleSubmit() {
    setError(null)
    setLoading(true)
    setReport(null)
    
    if (downloadUrl) URL.revokeObjectURL(downloadUrl); 
    setDownloadUrl(null); 

    try {
        // --- Mock Obfuscation API Call ---
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        // 1. Create the MOCK OBFUSCATED OUTPUT (what the user downloads)
        const obfuscatedOutput = `// Obfuscated Code (Passes: ${options.passes.join(', ')}, Count: ${options.bogusCount})\n#include <stdio.h>\n/* ${options.bogusCount * 50} lines of garbage inserted */\nint main() { return 0; }`;
        
        // 2. Create the DOWNLOAD BLOB containing the mock obfuscated output
        const blob = new Blob([obfuscatedOutput], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        // 3. CRITICAL: MOCK SENDING ORIGINAL CODE TO BE ENCRYPTED/STORED
        // In a real app, this would be an API call storing the source code in a DB.
        // We'll simulate this by encoding the original code as the "decryption key" data.
        const encodedOriginalCode = Buffer.from(code).toString('base64');

        console.log("Original Code Encoded for Storage:", encodedOriginalCode);

        // 4. MOCK REPORT: This should actually be sent to the Dashboard history table
        // (We don't need to do that here, but this is where it would happen).
        const activePasses = options.passes.map(name => ({ name }));

        setReport({
            output_file: { path: "/output/obf_app.c", size_before: code.length, size_after: obfuscatedOutput.length },
            passes: activePasses,
            tests: { functional_test: "passed" },
            // Store the decryption payload in the report object temporarily for debugging
            decryptionPayload: encodedOriginalCode 
        });
        
        setDownloadUrl(url); // Set the Data URL for download

    } catch (e) {
      setError(e.message || 'An unknown error occurred during obfuscation.')
    } finally {
      setLoading(false)
    }
  }

  if (loadingAuth) {
    return <div className="text-center py-10 text-xl text-gray-400">Loading Obfuscator UI...</div>
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen"> 
        <div className="container mx-auto">
            {/* Page Header/Title */}
            <h1 className="text-4xl font-extrabold mb-1 text-purple-400">Code Obfuscator</h1>
            <p className="text-xl text-gray-400 mb-10">Transform your code into an encrypted fortress</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: SOURCE CODE INPUT (2/3 width on large screens) */}
                <div className="lg:col-span-2 space-y-8">
                    <Card 
                        title="Source Code Input" 
                        subtitle="Paste your code to obfuscate" 
                        icon={<Code size={24} />}
                    >
                        <CodeEditor value={code} onChange={setCode} />
                    </Card>

                    {/* Report Card (Placed here, though hidden by default) */}
                    <div className={report ? "block" : "hidden"}>
                        <Card 
                            title="Obfuscation Report" 
                            subtitle="Results of the last job" 
                            icon={<FileText size={24} />}
                        >
                            <ReportCard report={report} />
                            {downloadUrl && (
                                <div className="mt-4">
                                    <a
                                        href={downloadUrl}
                                        download="obfuscated_code.txt" 
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw size={16} /> Download Obfuscated File
                                    </a>
                                </div>
                            )}
                        </Card>
                    </div>
                    {error && <div className="mt-3 text-red-500">{error}</div>}
                </div>
                
                {/* RIGHT COLUMN: OPTIONS & BUTTON (1/3 width on large screens) */}
                <aside className="space-y-8">
                    <Card 
                        title="Obfuscation Options" 
                        subtitle="Configure the encryption passes" 
                        icon={<Zap size={24} />}
                    >
                        <OptionsPanel options={options} setOptions={setOptions} />
                        
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-lg shadow-xl flex items-center justify-center gap-2 transition duration-200"
                        >
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} /> 
                            {loading ? 'Obfuscating...' : 'Obfuscate Code'}
                        </button>
                    </Card>
                </aside>
            </div>
        </div>
    </div>
  )
}