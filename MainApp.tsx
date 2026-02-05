// Fix: Corrected the import statement for React hooks.
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { GoalsPage } from './pages/GoalsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Plus, Settings, HelpCircle, Gift, Menu } from 'lucide-react';
import { TransactionModal } from './components/features/TransactionModal';
import { PersonalStatementPage } from './pages/PersonalStatementPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { FinancialHealthPage } from './pages/FinancialHealthPage';
import { TaxPlanningPage } from './pages/TaxPlanningPage';
import { ProfilePage } from './pages/ProfilePage';
import { CreditCardsPage } from './pages/CreditCardsPage';
import { RelationshipsPage } from './pages/RelationshipsPage';
import { RiskProfileModal } from './pages/RiskProfileModal';
import { LifemapPage } from './pages/LifemapPage';
import { ToolsPage } from './pages/ToolsPage';
import { MarketPulsePage } from './pages/MarketPulsePage';
import { SoftwareMeltdownPage } from './pages/SoftwareMeltdownPage';
import { RelationshipBalanceSheetPage } from './pages/RelationshipBalanceSheetPage';
import { LastWillPage } from './pages/LastWillPage';
import { VisionBoardPage } from './pages/VisionBoardPage';

export const MainApp: React.FC = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [headerActions, setHeaderActions] = useState<React.ReactNode>(null);
    
    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        // Set body background for the main app, overriding the landing page default
        document.body.className = 'bg-slate-50 dark:bg-slate-900';
    }, []);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-zinc-800 dark:text-slate-200 font-sans">
            <Sidebar isMobileOpen={isMobileSidebarOpen} setMobileOpen={setIsMobileSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 flex-shrink-0 flex items-center justify-between md:justify-end px-4 sm:px-8">
                    <button 
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="md:hidden p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Open sidebar"
                    >
                        <Menu size={20} className="text-zinc-600 dark:text-slate-400" />
                    </button>
                    <div className="flex items-center gap-2">
                        {headerActions}
                        <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors">
                            <Gift size={20} className="text-zinc-600 dark:text-slate-400" />
                        </button>
                         <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-slate-700 flex items-center justify-center font-semibold text-zinc-600 dark:text-slate-300 text-sm">
                            PC
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors">
                            <Plus size={20} className="text-zinc-600 dark:text-slate-400" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors">
                            <HelpCircle size={20} className="text-zinc-600 dark:text-slate-400" />
                        </button>
                         <NavLink to="/settings" className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors">
                            <Settings size={20} className="text-zinc-600 dark:text-slate-400" />
                        </NavLink>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage setHeaderActions={setHeaderActions} />} />
                        <Route path="/transactions" element={<TransactionsPage setHeaderActions={setHeaderActions} />} />
                        <Route path="/budgets" element={<BudgetsPage />} />
                        <Route path="/subscriptions" element={<SubscriptionsPage />} />
                        <Route path="/goals" element={<GoalsPage setHeaderActions={setHeaderActions} />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/market-pulse" element={<MarketPulsePage setHeaderActions={setHeaderActions} />} />
                        <Route path="/software-meltdown" element={<SoftwareMeltdownPage setHeaderActions={setHeaderActions} />} />
                        <Route path="/health" element={<FinancialHealthPage />} />
                        <Route path="/relationship-balance-sheet" element={<RelationshipBalanceSheetPage />} />
                        <Route path="/tax-planning" element={<TaxPlanningPage />} />
                        <Route path="/statement" element={<PersonalStatementPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/credit-cards" element={<CreditCardsPage setHeaderActions={setHeaderActions} />} />
                        <Route path="/relationships" element={<RelationshipsPage setHeaderActions={setHeaderActions} />} />
                        <Route path="/lifemap" element={<LifemapPage setHeaderActions={setHeaderActions} />} />
                        <Route path="/tools" element={<ToolsPage />} />
                        <Route path="/last-will" element={<LastWillPage />} />
                        <Route path="/vision-board" element={<VisionBoardPage setHeaderActions={setHeaderActions} />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </main>
            </div>
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transaction={null}
            />
        </div>
    );
};