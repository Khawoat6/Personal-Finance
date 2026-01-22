
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
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
    UserCircle2
} from 'lucide-react';

const navGroups = [
    {
        title: 'Overview',
        items: [
            { to: '/', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/transactions', label: 'Transactions', icon: Receipt },
            { to: '/budgets', label: 'Budgets', icon: PiggyBank },
            { to: '/subscriptions', label: 'Subscriptions', icon: Repeat },
            { to: '/goals', label: 'Goals', icon: Target },
        ]
    },
    {
        title: 'Analysis',
        items: [
            { to: '/reports', label: 'Reports', icon: BarChart2 },
            { to: '/statement', label: 'Statement', icon: FileText },
        ]
    }
];

const NavItem: React.FC<{ to: string, label: string, icon: React.ElementType }> = ({ to, label, icon: Icon }) => (
     <NavLink
        to={to}
        end={to === '/'}
        className={({ isActive }) =>
            `group flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors relative ${
                isActive
                    ? 'font-semibold bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100'
                    : 'font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
            }`
        }
    >
        {({ isActive }) => (
            <>
                <span className={`absolute left-0 h-6 w-1 bg-slate-800 dark:bg-slate-200 rounded-r-full transition-transform duration-300 ease-in-out ${isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50'}`}></span>
                <Icon className="w-5 h-5 mr-4" />
                <span>{label}</span>
            </>
        )}
    </NavLink>
);

export const Sidebar: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

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
        <aside className="w-72 flex-shrink-0 bg-white dark:bg-slate-800/50 border-r border-gray-100 dark:border-slate-800 flex flex-col">
            <div className="h-16 flex items-center px-6">
                <Wallet className="h-7 w-7 text-slate-800 dark:text-slate-200" />
                <span className="ml-3 text-lg font-bold text-slate-900 dark:text-slate-100">FinanceApp</span>
            </div>
            
            <nav className="flex-1 px-6 py-4 space-y-6">
                {navGroups.map((group) => (
                    <div key={group.title}>
                        <h3 className="px-4 mb-2 text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">{group.title}</h3>
                        <div className="space-y-2">
                            {group.items.map((item) => (
                                <NavItem key={item.to} {...item} />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-6 border-t border-gray-100 dark:border-slate-800 space-y-4">
                 <NavItem to="/settings" label="Settings" icon={Settings} />
                 
                 <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900/50">
                    <div className="flex items-center">
                        <UserCircle2 className="h-8 w-8 text-slate-500" />
                        <div className="ml-3">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">John Doe</p>
                            <p className="text-xs text-slate-500">Free Plan</p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="ml-auto p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700/50"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? <Sun className="h-5 w-5 text-slate-400" /> : <Moon className="h-5 w-5 text-slate-500" />}
                        </button>
                    </div>
                 </div>
            </div>
        </aside>
    );
};
