import React, { useRef, useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { Download, Upload, Sun, Moon } from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const { exportData, importData } = useData();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'THB');
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');


    const handleThemeChange = (theme: 'light' | 'dark') => {
        setCurrentTheme(theme);
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };
    
    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrency = e.target.value;
        setCurrency(newCurrency);
        localStorage.setItem('currency', newCurrency);
        alert("Currency preference saved. The change will be applied app-wide after you refresh the page.");
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
        alert("Language preference saved. App-wide change will apply on next refresh (feature in development).");
    };


    const handleExport = (format: 'json' | 'csv') => {
        const data = exportData();
        let fileContent: string;
        let fileType: string;
        let fileName: string;

        if (format === 'json') {
            fileContent = JSON.stringify(data, null, 2);
            fileType = 'application/json';
            fileName = `finance-data-backup.json`;
        } else {
            // Basic CSV conversion for transactions
            const header = 'id,date,amount,type,categoryId,accountId,note\n';
            const rows = data.transactions.map(t => 
                `${t.id},${t.date},${t.amount},${t.type},${t.categoryId},${t.accountId},"${t.note || ''}"`
            ).join('\n');
            fileContent = header + rows;
            fileType = 'text/csv';
            fileName = 'finance-transactions.csv';
            alert('CSV export currently only supports transactions.');
        }

        const blob = new Blob([fileContent], { type: fileType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            alert('Import failed: Only .json backup files are supported.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result;
                if (typeof content !== 'string') throw new Error('Invalid file content');
                
                const data = JSON.parse(content);
                // Simple validation
                if (data.transactions && data.categories && data.accounts) {
                    if (window.confirm('Are you sure you want to import this data? This will overwrite your current data.')) {
                        await importData(data);
                        alert('Data imported successfully! The page will now reload.');
                        window.location.reload();
                    }
                } else {
                    throw new Error('Invalid data structure');
                }
            } catch (error) {
                console.error('Import failed:', error);
                alert('Import failed. Please make sure the file is a valid JSON backup.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
             <Card>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Appearance</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Choose how the application looks.</p>
                <div className="p-1.5 rounded-xl flex bg-slate-100 dark:bg-slate-700 w-fit">
                    <button 
                        onClick={() => handleThemeChange('light')} 
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${currentTheme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <Sun size={16} /> Light
                    </button>
                    <button 
                        onClick={() => handleThemeChange('dark')} 
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${currentTheme === 'dark' ? 'dark:bg-slate-800 text-white shadow-sm' : 'dark:text-slate-400 dark:hover:text-white'}`}
                    >
                        <Moon size={16} /> Dark
                    </button>
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Preferences</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Customize your experience.</p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Currency</label>
                        <select id="currency" value={currency} onChange={handleCurrencyChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700">
                            <option value="THB">Thai Baht (THB)</option>
                            <option value="USD">US Dollar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="JPY">Japanese Yen (JPY)</option>
                            <option value="GBP">British Pound (GBP)</option>
                            <option value="BTC">Bitcoin (BTC)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Language</label>
                        <select id="language" value={language} onChange={handleLanguageChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700">
                            <option value="en">English</option>
                            <option value="th">ภาษาไทย (Thai)</option>
                        </select>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Data Management</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Export your data for backup or import to restore.</p>
                <div className="flex flex-col md:flex-row gap-4">
                    <button onClick={() => handleExport('json')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300">
                        <Download className="h-4 w-4" /> Export as JSON
                    </button>
                    <button onClick={() => handleExport('csv')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300">
                        <Download className="h-4 w-4" /> Export as CSV
                    </button>
                </div>
                 <div className="mt-4">
                    <button onClick={handleImportClick} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600">
                        <Upload className="h-4 w-4" /> Import from JSON
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".json"
                    />
                </div>
            </Card>
        </div>
    );
};