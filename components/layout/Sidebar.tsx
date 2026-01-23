import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Wallet,
    Trophy,
    GanttChart,
    ChartPie,
    FileSpreadsheet,
    WalletCards,
    ClipboardList,
    Settings,
    X,
    HeartPulse,
    User,
    CreditCard,
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
            { to: '/health', label: 'Health Check', icon: HeartPulse },
            { to: '/tax-planning', label: 'Tax Planning', icon: FileSpreadsheet },
            { to: '/statement', label: 'Statement', icon: ChartPie },
        ]
    },
    {
        title: 'MANAGE',
        items: [
            { to: '/profile', label: 'Profile', icon: User },
            { to: '/credit-cards', label: 'Credit Cards', icon: CreditCard },
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

interface SidebarProps {
    isMobileOpen: boolean;
    setMobileOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setMobileOpen }) => {
    const sidebarClasses = `
        w-64 flex-shrink-0 flex flex-col border-r border-zinc-200 dark:border-slate-800 
        bg-slate-50 dark:bg-slate-900
        fixed md:static inset-y-0 left-0 z-40
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
    `;

    return (
        <>
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-30 md:hidden" 
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                ></div>
            )}
            <aside className={sidebarClasses}>
                <div className="h-20 flex items-center justify-between px-6">
                    <img src="https://respectable-aquamarine-a7gbuo21fj.edgeone.app/app-icon-black-border-radius.png" alt="Findee Logo" className="h-14" />
                    <button 
                        onClick={() => setMobileOpen(false)} 
                        className="md:hidden p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
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
        </>
    );
};