
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-slate-800 rounded-2xl border border-zinc-200 dark:border-slate-700 p-6 ${className}`}
        >
            {children}
        </div>
    );
};