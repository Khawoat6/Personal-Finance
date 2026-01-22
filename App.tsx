
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { GoalsPage } from './pages/GoalsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { DataProvider } from './hooks/useData';
import { PlusCircle } from 'lucide-react';
import { TransactionModal } from './components/features/TransactionModal';
import { PersonalStatementPage } from './pages/PersonalStatementPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthPage } from './pages/AuthPage';

const AppContent: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const getPageConfig = () => {
        switch (location.pathname) {
            case '/': return { title: 'Dashboard', showAddButton: true };
            case '/transactions': return { title: 'Transactions', showAddButton: true };
            case '/budgets': return { title: 'Budgets', showAddButton: false };
            case '/subscriptions': return { title: 'Subscriptions', showAddButton: false };
            case '/goals': return { title: 'Goals', showAddButton: false };
            case '/reports': return { title: 'Reports', showAddButton: false };
            case '/statement': return { title: 'Personal Statement', showAddButton: false };
            case '/settings': return { title: 'Settings', showAddButton: false };
            default: return { title: 'Personal Finance', showAddButton: true };
        }
    };
    
    const pageConfig = getPageConfig();

    return (
        <DataProvider>
            <div className="flex h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                <Sidebar />
                <main className="flex-1 flex flex-col overflow-hidden">
                    <header className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-slate-800">
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">{pageConfig.title}</h1>
                        {pageConfig.showAddButton && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500 transition-colors"
                            >
                                <PlusCircle className="h-4 w-4" />
                                <span>Add Transaction</span>
                            </button>
                        )}
                    </header>
                    <div className="flex-1 overflow-y-auto p-4 md:p-6">
                        <Routes>
                            <Route path="/" element={<DashboardPage />} />
                            <Route path="/transactions" element={<TransactionsPage />} />
                            <Route path="/budgets" element={<BudgetsPage />} />
                            <Route path="/subscriptions" element={<SubscriptionsPage />} />
                            <Route path="/goals" element={<GoalsPage />} />
                            <Route path="/reports" element={<ReportsPage />} />
                            <Route path="/statement" element={<PersonalStatementPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                    </div>
                </main>
                <TransactionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    transaction={null}
                />
            </div>
        </DataProvider>
    );
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <AuthGate />
        </AuthProvider>
    );
};

const AuthGate: React.FC = () => {
    const { session, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-slate-900">
                <p className="text-slate-500">Loading Application...</p>
            </div>
        )
    }

    if (!session) {
        return <AuthPage />;
    }

    return <AppContent />;
};

export default App;
