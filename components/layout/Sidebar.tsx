import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Wallet,
    Trophy,
    GanttChart,
    ChartPie,
    WalletCards,
    ClipboardList,
    Settings,
} from 'lucide-react';

const navGroups = [
    {
        title: 'TRACK',
        items: [
            { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
            { to: '/transactions', label: 'Spending', icon: Wallet },
            { to: '/budgets', label: 'Budgets', icon: ClipboardList },
            { to: '/goals', label: 'Goals', icon: Trophy },
        ]
    },
    {
        title: 'REPORTS',
        items: [
            { to: '/reports', label: 'Forecast', icon: GanttChart },
            { to: '/statement', label: 'Statement', icon: ChartPie },
        ]
    },
    {
        title: 'MANAGE',
        items: [
            { to: '/subscriptions', label: 'Subscriptions', icon: WalletCards },
            { to: '/settings', label: 'Settings', icon: Settings },
        ]
    }
];

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
        <aside className="w-64 flex-shrink-0 flex flex-col border-r border-zinc-200 dark:border-slate-800">
            <div className="h-20 flex items-center px-6">
                <span className="text-2xl font-bold font-serif tracking-wider text-zinc-900 dark:text-slate-100">FINDEE</span>
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
        </aside>
    );
};