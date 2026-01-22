
import React from 'react';

export const AppLogo = ({ className = '' }: { className?: string }) => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M14 2C8.47715 2 4 6.47715 4 12C4 17.5228 8.47715 22 14 22C19.5228 22 24 17.5228 24 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 26C19.5228 26 24 21.5228 24 16C24 10.4772 19.5228 6 14 6C8.47715 6 4 10.4772 4 16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);