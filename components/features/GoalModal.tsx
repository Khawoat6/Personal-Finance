
import React, { useState, useEffect } from 'react';
import type { Goal } from '../../types';
import { useData } from '../../hooks/useData';
import { XCircle } from 'lucide-react';

interface GoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    goal: Goal | null;
}

const GOAL_CATEGORIES = ["Travel", "Technology", "Major Purchase", "Home Improvement", "Education", "Financial", "Other"];

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, goal }) => {
    const { addGoal, updateGoal } = useData();
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [category, setCategory] = useState(GOAL_CATEGORIES[0]);

    useEffect(() => {
        if (goal) {
            setName(goal.name);
            setTargetAmount(String(goal.targetAmount));
            setCurrentAmount(String(goal.currentAmount));
            setDeadline(new Date(goal.deadline).toISOString().split('T')[0]);
            setCategory(goal.category || GOAL_CATEGORIES[0]);
        } else {
            setName('');
            setTargetAmount('');
            setCurrentAmount('0');
            setDeadline(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]);
            setCategory(GOAL_CATEGORIES[0]);
        }
    }, [goal, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const goalData = {
            name,
            targetAmount: parseFloat(targetAmount),
            currentAmount: parseFloat(currentAmount),
            deadline: new Date(deadline).toISOString(),
            category,
        };

        if (goal) {
            await updateGoal({ ...goalData, id: goal.id });
        } else {
            await addGoal(goalData);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md m-4">
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {goal ? 'Edit Goal' : 'Add New Goal'}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <XCircle className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Goal Name</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700" placeholder="e.g., New Laptop" />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                <select id="category" value={category} onChange={e => setCategory(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700">
                                    {GOAL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                                <label htmlFor="targetAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Amount (THB)</label>
                                <input type="number" id="targetAmount" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700" />
                            </div>
                            <div>
                                <label htmlFor="currentAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Amount (THB)</label>
                                <input type="number" id="currentAmount" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="deadline" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deadline</label>
                            <input type="date" id="deadline" value={deadline} onChange={e => setDeadline(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700" />
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-700 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-md hover:bg-slate-700 dark:hover:bg-slate-300">{goal ? 'Save Changes' : 'Add Goal'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};