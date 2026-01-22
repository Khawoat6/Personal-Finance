
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Fix: Moved dummy Lucide icon declarations to the top to resolve block-scoped variable errors.
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

const LayoutDashboard = createLucideIcon('LayoutDashboard');
const Receipt = createLucideIcon('Receipt');
const PiggyBank = createLucideIcon('PiggyBank');
const Target = createLucideIcon('Target');
const BarChart2 = createLucideIcon('BarChart2');
const Settings = createLucideIcon('Settings');
const Sun = createLucideIcon('Sun');
const Moon = createLucideIcon('Moon');
const Wallet = createLucideIcon('Wallet');
const FileText = createLucideIcon('FileText');
const Repeat = createLucideIcon('Repeat');
const LogOut = createLucideIcon('LogOut');

const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/transactions', label: 'Transactions', icon: Receipt },
    { to: '/budgets', label: 'Budgets', icon: PiggyBank },
    { to: '/subscriptions', label: 'Subscriptions', icon: Repeat },
    { to: '/goals', label: 'Goals', icon: Target },
    { to: '/reports', label: 'Reports', icon: BarChart2 },
    { to: '/statement', label: 'Statement', icon: FileText },
    { to: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { user, signOut } = useAuth();

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        setIsDarkMode(!isDarkMode);
    };

    return (
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800/50 border-r border-gray-200 dark:border-slate-800 flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-slate-800">
                <Wallet className="h-7 w-7 text-slate-800 dark:text-slate-200" />
                <span className="ml-3 text-lg font-semibold text-slate-900 dark:text-slate-100">FinanceApp</span>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-slate-800 space-y-2">
                 <div className="px-2 py-2 text-center text-xs text-slate-500 dark:text-slate-400">
                    <p className="font-medium truncate">{user?.email}</p>
                </div>
                 <button
                    onClick={signOut}
                    className="w-full flex items-center justify-center p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="ml-2 text-sm">Log Out</span>
                </button>
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50"
                >
                    {isDarkMode ? <Sun className="h-5 w-5 text-slate-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
                    <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>
            </div>
        </aside>
    );
};
