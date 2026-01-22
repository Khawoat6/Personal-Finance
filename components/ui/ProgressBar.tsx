
import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
    colorClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, colorClass = 'bg-slate-700 dark:bg-slate-300' }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const safePercentage = Math.min(100, Math.max(0, percentage));

    return (
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div
                className={`h-2 rounded-full transition-all duration-500 ${colorClass}`}
                style={{ width: `${safePercentage}%` }}
            ></div>
        </div>
    );
};
