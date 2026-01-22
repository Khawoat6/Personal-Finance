
import React, { useState, useEffect } from 'react';
import type { Goal } from '../../types';
import { useData } from '../../hooks/useData';
import { Modal } from '../ui/Modal';
import { formatCurrency } from '../../utils/formatters';

interface ContributeModalProps {
    isOpen: boolean;
    onClose: () => void;
    goal: Goal | null;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({ isOpen, onClose, goal }) => {
    const { accounts, contributeToGoal } = useData();
    const [amount, setAmount] = useState('');
    const [accountId, setAccountId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setError('');
            if (accounts.length > 0) {
                setAccountId(accounts[0].id);
            }
        }
    }, [isOpen, accounts]);

    if (!isOpen || !goal) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const contributionAmount = parseFloat(amount);
        if (isNaN(contributionAmount) || contributionAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        
        const selectedAccount = accounts.find(a => a.id === accountId);
        if (!selectedAccount) {
             setError('Please select a valid account.');
             return;
        }
        
        if (selectedAccount.balance < contributionAmount) {
            setError('Insufficient funds in the selected account.');
            return;
        }

        await contributeToGoal(goal.id, contributionAmount, accountId);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Contribute to: ${goal.name}`}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Current Progress: {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                        </p>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (THB)</label>
                        <input 
                            type="number" 
                            id="amount" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700"
                            placeholder="e.g., 500"
                        />
                    </div>
                    <div>
                        <label htmlFor="account" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">From Account</label>
                        <select 
                            id="account" 
                            value={accountId} 
                            onChange={e => setAccountId(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700"
                        >
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.name} ({formatCurrency(acc.balance)})
                                </option>
                            ))}
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
                <div className="pt-6 mt-2 flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600">Cancel</button>
                    <button type="submit" className="ml-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-md hover:bg-slate-700 dark:hover:bg-slate-300">Contribute</button>
                </div>
            </form>
        </Modal>
    );
};
