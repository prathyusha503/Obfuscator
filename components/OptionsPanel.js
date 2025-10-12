import { Zap } from 'lucide-react'; // Using lucide-react for icons

// Utility component for the custom toggle switch
const ToggleSwitch = ({ label, checked, onChange, name }) => {
    // Custom purple/cyan toggle track and switch styling
    const trackClass = checked 
        ? 'bg-purple-600' 
        : 'bg-gray-600';

    const switchClass = checked 
        ? 'translate-x-6 bg-white' 
        : 'translate-x-1 bg-white';
        
    return (
        <div className="flex items-center justify-between py-2.5">
            <label htmlFor={name} className="text-white text-md cursor-pointer">
                {label}
            </label>
            <div 
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${trackClass}`}
                onClick={onChange}
            >
                <div 
                    className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${switchClass}`}
                ></div>
            </div>
        </div>
    );
};


export default function OptionsPanel({ options, setOptions }) {
    
    // Handler for the Number of Passes slider
    const handlePassesChange = (e) => {
        setOptions(prev => ({ 
            ...prev, 
            bogusCount: Number(e.target.value) 
        }));
    };

    // Handler for boolean toggles
    const handleToggle = (name) => {
        setOptions(prev => ({
            ...prev,
            passes: prev.passes.includes(name) 
                ? prev.passes.filter(p => p !== name) // Remove pass if unchecked
                : [...prev.passes, name]             // Add pass if checked
        }));
    };

    // Helper to check if a pass is enabled
    const isPassEnabled = (name) => options.passes.includes(name);

    // Mock options mapping (based on the new visual structure)
    const toggleOptions = [
        { label: "String Encryption", name: "string-encrypt" },
        { label: "Control Flow Flattening", name: "cfg-flatten" },
        { label: "Dead Code Injection", name: "bogus-insert" }, // Using bogus-insert for injection logic
    ];


    return (
        <div className="space-y-6">
            {/* 1. Number of Passes Slider */}
            <div>
                <label className="block text-md font-medium text-white mb-3">
                    Number of Passes: {options.bogusCount}
                </label>
                
                <input 
                    type="range"
                    min="1"
                    max="10"
                    value={options.bogusCount}
                    onChange={handlePassesChange}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-cyan-400/30"
                    style={{
                        // Custom track styling to match the visual design (purple/cyan)
                        '--tw-range-thumb-color': '#a855f7',
                        '--tw-range-thumb-width': '1.25rem',
                        '--tw-range-track-color': '#00bcd4',
                        height: '0.5rem',
                        borderRadius: '0.25rem',
                        outline: 'none',
                    }}
                />
            </div>
            
            <div className="pt-4 border-t border-gray-700/50 space-y-4">
                {/* 2. Toggle Switches for Encryption Passes */}
                {toggleOptions.map(opt => (
                    <ToggleSwitch
                        key={opt.name}
                        label={opt.label}
                        name={opt.name}
                        checked={isPassEnabled(opt.name)}
                        onChange={() => handleToggle(opt.name)}
                    />
                ))}
            </div>

        </div>
    );
}
