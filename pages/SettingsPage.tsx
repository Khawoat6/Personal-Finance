
import React, { useRef } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { Download, Upload } from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const { exportData, importData } = useData();
    const fileInputRef = useRef<HTMLInputElement>(null);

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

// Dummy Lucide Icons
const createLucideIcon = (name: string) => {
    const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <title>{name}</title>
        </svg>
    );
    Icon.displayName = name;
    return Icon;
};

const Download = createLucideIcon('Download');
const Upload = createLucideIcon('Upload');
