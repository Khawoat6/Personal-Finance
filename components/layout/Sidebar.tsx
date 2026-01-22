
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    CircleDollarSign,
    TrendingUp,
    BarChart3,
    PieChart,
    FileText,
    Settings,
    BookOpen,
    Repeat,
} from 'lucide-react';
import { AIAssistant } from '../features/AIAssistant';

const navGroups = [
    {
        title: 'TRACK',
        items: [
            { to: '/dashboard', label: 'Home', icon: Home },
            { to: '/transactions', label: 'Spending', icon: CircleDollarSign },
            { to: '/goals', label: 'Invest', icon: TrendingUp },
            { to: '/reports', label: 'Forecast', icon: BarChart3 },
            { to: '/statement', label: 'Equity', icon: PieChart },
        ]
    },
    {
        title: 'SERVICES',
        items: [
            { to: '/subscriptions', label: 'Brokerage', icon: Repeat },
            { to: '/budgets', label: 'Estate Planning', icon: BookOpen },
            { to: '/settings', label: 'Tax', icon: FileText },
        ]
    }
];

const OriginLogo = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 25.6667C20.4434 25.6667 25.6667 20.4434 25.6667 14C25.6667 7.55663 20.4434 2.33331 14 2.33331C7.55663 2.33331 2.33334 7.55663 2.33334 14C2.33334 20.4434 7.55663 25.6667 14 25.6667Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.5 15.1667C17.5 17.1325 15.9325 18.6667 14 18.6667C12.0675 18.6667 10.5 17.1325 10.5 15.1667C10.5 13.2008 12.0675 11.6667 14 11.6667C15.9325 11.6667 17.5 13.2008 17.5 15.1667Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M10.5 15.1667H5.83334" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22.1667 15.1667H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 11.6667V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 21V18.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);


const NavItem: React.FC<{ to: string, label: string, icon: React.ElementType }> = ({ to, label, icon: Icon }) => (
     <NavLink
        to={to}
        end={to === '/dashboard'}
        className={({ isActive }) =>
            `group flex items-center px-3 py-2 text-base rounded-md transition-colors ${
                isActive
                    ? 'font-semibold bg-zinc-100 dark:bg-slate-700/50 text-zinc-900 dark:text-slate-100'
                    : 'font-normal text-zinc-600 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-slate-700/50 hover:text-zinc-900 dark:hover:text-slate-100'
            }`
        }
    >
        <Icon className="w-5 h-5 mr-3" />
        <span>{label}</span>
    </NavLink>
);

export const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800/50 border-r border-zinc-200 dark:border-slate-800 flex flex-col">
            <div className="h-20 flex items-center px-6">
                <OriginLogo />
                <span className="ml-2 text-xl font-medium text-zinc-900 dark:text-slate-100">Origin</span>
            </div>
            
            <nav className="flex-1 px-4 py-4 space-y-6">
                {navGroups.map((group) => (
                    <div key={group.title}>
                        <h3 className="px-3 mb-2 text-xs font-semibold tracking-wider text-zinc-400 dark:text-slate-500 uppercase">{group.title}</h3>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <NavItem key={item.to} {...item} />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-zinc-200 dark:border-slate-800">
                 <AIAssistant />
            </div>
        </aside>
    );
};