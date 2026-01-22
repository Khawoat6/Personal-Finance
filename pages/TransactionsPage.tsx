
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Transaction } from '../types';
import { Card } from '../components/ui/Card';
import { TransactionModal } from '../components/features/TransactionModal';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

export const TransactionsPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const { transactions, categories, accounts, deleteTransaction, loading } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedAccount, setSelectedAccount] = useState<string>('all');

    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
        setHeaderActions(
             <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500 transition-colors"
            >
                <PlusCircle className="h-4 w-4" />
                <span>Add Transaction</span>
            </button>
        );
        return () => setHeaderActions(null);
    }, [setHeaderActions]);

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            await deleteTransaction(id);
        }
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => {
                const note = t.note || '';
                const categoryName = categories.find(c => c.id === t.categoryId)?.name || '';
                return note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       categoryName.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .filter(t => selectedMonth === 'all' || new Date(t.date).getMonth() === parseInt(selectedMonth))
            .filter(t => selectedCategory === 'all' || t.categoryId === selectedCategory)
            .filter(t => selectedAccount === 'all' || t.accountId === selectedAccount)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, categories, searchTerm, selectedMonth, selectedCategory, selectedAccount]);

    const monthOptions = useMemo(() => {
        const months = new Set<number>();
        transactions.forEach(t => months.add(new Date(t.date).getMonth()));
        return Array.from(months).map(m => ({ value: m, label: new Date(2000, m).toLocaleString('default', { month: 'long' }) }));
    }, [transactions]);


    if (loading) {
        return <div className="text-center p-10">Loading transactions...</div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700"
                    />
                    <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700">
                        <option value="all">All Months</option>
                        {monthOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700">
                        <option value="all">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700">
                        <option value="all">All Accounts</option>
                        {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                </div>
            </Card>

            <Card className="overflow-x-auto">
                 <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Note</th>
                            <th scope="col" className="px-6 py-3 text-right">Amount</th>
                            <th scope="col" className="px-6 py-3">Account</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((t) => {
                                const category = categories.find(c => c.id === t.categoryId);
                                const account = accounts.find(a => a.id === t.accountId);
                                return (
                                    <tr key={t.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                        <td className="px-6 py-4">{formatDate(t.date)}</td>
                                        <td className="px-6 py-4">{category?.name || 'Uncategorized'}</td>
                                        <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{t.note}</td>
                                        <td className={`px-6 py-4 text-right font-medium ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                            {t.type === 'expense' ? '-' : ''}{formatCurrency(t.amount)}
                                        </td>
                                        <td className="px-6 py-4">{account?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button onClick={() => handleEdit(t)} className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">
                                                    <Edit className="h-4 w-4 text-slate-500" />
                                                </button>
                                                <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50">
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10">
                                    <h3 className="text-lg font-semibold">No transactions found</h3>
                                    <p className="text-slate-500 mt-1">Try adjusting your filters or add a new transaction.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>
            {isModalOpen && <TransactionModal isOpen={isModalOpen} onClose={closeModal} transaction={editingTransaction} />}
        </div>
    );
};