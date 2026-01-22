
import React from 'react';
import { useData } from '../../hooks/useData';
import { ProgressBar } from '../ui/ProgressBar';
import { formatCurrency } from '../../utils/formatters';
import { Building2, Trophy } from 'lucide-react';

export const RightSidebar: React.FC = () => {
    const { accounts, goals, loading } = useData();

    if (loading) {
        return (
            <aside className="w-80 flex-shrink-0 p-6 hidden lg:block">
                <div className="animate-pulse space-y-8">
                    <div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        </div>
                    </div>
                     <div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                        <div className="space-y-4">
                            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </aside>
        );
    }
    
    return (
        <aside className="w-80 flex-shrink-0 p-6 hidden lg:block overflow-y-auto">
            <div className="space-y-8">
                <div>
                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-slate-400 uppercase tracking-wider mb-4">Accounts</h3>
                    <div className="space-y-3">
                        {accounts.map(account => (
                            <div key={account.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                        <Building2 size={16} className="text-zinc-500 dark:text-slate-400" />
                                    </div>
                                    <span className="font-medium text-zinc-800 dark:text-slate-200 truncate">{account.name}</span>
                                </div>
                                <span className="font-semibold text-zinc-900 dark:text-slate-100 whitespace-nowrap pl-2">{formatCurrency(account.balance)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-slate-400 uppercase tracking-wider mb-4">Goals</h3>
                    <div className="space-y-4">
                        {goals.length > 0 ? goals.map(goal => (
                            <div key={goal.id} className="p-4 rounded-xl border border-zinc-200 dark:border-slate-700 bg-zinc-50 dark:bg-slate-800">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-zinc-800 dark:text-slate-200">{goal.name}</h4>
                                    <Trophy size={18} className="text-zinc-400 dark:text-slate-500 flex-shrink-0" />
                                </div>
                                <ProgressBar value={goal.currentAmount} max={goal.targetAmount} colorClass="bg-purple-600" />
                                <div className="flex justify-between items-baseline mt-2 text-xs">
                                    <span className="font-medium text-zinc-600 dark:text-slate-300">{formatCurrency(goal.currentAmount)}</span>
                                    <span className="text-zinc-500 dark:text-slate-400"> of {formatCurrency(goal.targetAmount)}</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-zinc-500 dark:text-slate-400 text-center py-4">No goals set yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};