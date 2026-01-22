
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
    LayoutDashboard, 
    Receipt, 
    PiggyBank, 
    Target, 
    BarChart2, 
    Settings, 
    Sun, 
    Moon, 
    Wallet, 
    FileText, 
    Repeat, 
    LogOut,
    UserCircle
} from 'lucide-react';

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
            <div className="p-4 border-t border-gray-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <UserCircle className="h-8 w-8 text-slate-500" />
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {user?.email || 'User'}
                        </p>
                    </div>
                    <button
                        onClick={signOut}
                        title="Log Out"
                        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>

                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-start px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                    {isDarkMode ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />}
                    <span className="text-sm font-medium">
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>
            </div>
        </aside>
    );
};
