
import React, { useState, useEffect } from 'react';
import type { Transaction } from '../../types';
import { useData } from '../../hooks/useData';
import { XCircle } from 'lucide-react';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, transaction }) => {
    const { accounts, categories, addTransaction, updateTransaction } = useData();
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');

    useEffect(() => {
        if (transaction) {
            setType(transaction.type);
            setAmount(String(transaction.amount));
            setCategoryId(transaction.categoryId);
            setAccountId(transaction.accountId);
            setDate(new Date(transaction.date).toISOString().split('T')[0]);
            setNote(transaction.note || '');
        } else {
            // Reset form for new transaction
            setType('expense');
            setAmount('');
            setCategoryId(categories.find(c => c.type === 'expense')?.id || '');
            setAccountId(accounts[0]?.id || '');
            setDate(new Date().toISOString().split('T')[0]);
            setNote('');
        }
    }, [transaction, isOpen, categories, accounts]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const transactionData = {
            date: new Date(date).toISOString(),
            amount: parseFloat(amount),
            type,
            categoryId,
            accountId,
            note,
        };

        if (transaction) {
            await updateTransaction({ ...transactionData, id: transaction.id });
        } else {
            await addTransaction(transactionData);
        }
        onClose();
    };

    if (!isOpen) return null;

    const filteredCategories = categories.filter(c => c.type === type);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md m-4">
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {transaction ? 'Edit Transaction' : 'Add Transaction'}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <XCircle className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" onClick={() => setType('expense')} className={`p-3 rounded-lg border ${type === 'expense' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800' : 'bg-slate-50 dark:bg-slate-700'}`}>
                                Expense
                            </button>
                            <button type="button" onClick={() => setType('income')} className={`p-3 rounded-lg border ${type === 'income' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800' : 'bg-slate-50 dark:bg-slate-700'}`}>
                                Income
                            </button>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (THB)</label>
                            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700">
                                    {filteredCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="account" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account</label>
                                <select id="account" value={accountId} onChange={e => setAccountId(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700">
                                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700" />
                        </div>
                        <div>
                            <label htmlFor="note" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Note (Optional)</label>
                            <input type="text" id="note" value={note} onChange={e => setNote(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700" />
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-700 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-md hover:bg-slate-700 dark:hover:bg-slate-300">{transaction ? 'Save Changes' : 'Add Transaction'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
