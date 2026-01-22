
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div
            className={`bg-white dark:bg-slate-800/50 rounded-2xl border border-zinc-200 dark:border-slate-800 p-6 ${className}`}
        >
            {children}
        </div>
    );
};