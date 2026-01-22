
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Wallet,
    Trophy,
    GanttChart,
    ChartPie,
    ReceiptText,
    ShieldHalf,
    WalletCards,
} from 'lucide-react';
import { AppLogo } from '../ui/AppLogo';

const navGroups = [
    {
        title: 'TRACK',
        items: [
            { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
            { to: '/transactions', label: 'Spending', icon: Wallet },
            { to: '/goals', label: 'Goals', icon: Trophy },
            { to: '/reports', label: 'Forecast', icon: GanttChart },
            { to: '/statement', label: 'Statement', icon: ChartPie },
        ]
    },
    {
        title: 'SERVICES',
        items: [
            { to: '/subscriptions', label: 'Subscription', icon: WalletCards },
            { to: '/budgets', label: 'Estate Planning', icon: ShieldHalf },
            { to: '/settings', label: 'Tax', icon: ReceiptText },
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
        <aside className="w-64 flex-shrink-0 flex flex-col">
            <div className="h-20 flex items-center px-6">
                <AppLogo />
                <span className="ml-2 text-xl font-medium text-zinc-900 dark:text-slate-100">Nova Folio</span>
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