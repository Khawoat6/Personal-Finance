
import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Trophy, PlusCircle, Pencil, Trash2, Plane, Laptop, ShoppingBag, Home, GraduationCap, Landmark, Star } from 'lucide-react';
import { GoalModal } from '../components/features/GoalModal';
import type { Goal } from '../types';

const getGoalCategoryIcon = (category: string | undefined) => {
    const iconProps = { size: 20, className: "text-slate-500 dark:text-slate-400" };
    switch (category) {
        case 'Travel': return <Plane {...iconProps} />;
        case 'Technology': return <Laptop {...iconProps} />;
        case 'Major Purchase': return <ShoppingBag {...iconProps} />;
        case 'Home Improvement': return <Home {...iconProps} />;
        case 'Education': return <GraduationCap {...iconProps} />;
        case 'Financial': return <Landmark {...iconProps} />;
        default: return <Star {...iconProps} />;
    }
};


export const GoalsPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const { goals, deleteGoal, loading } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    useEffect(() => {
        setHeaderActions(
            <button
                onClick={() => { setEditingGoal(null); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300"
            >
                <PlusCircle className="h-4 w-4" />
                <span>New Goal</span>
            </button>
        );
        return () => setHeaderActions(null);
    }, [setHeaderActions]);

    const handleEdit = (goal: Goal) => {
        setEditingGoal(goal);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            await deleteGoal(id);
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading goals...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Goals</h1>
            
            {goals.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => {
                        const percentage = (goal.targetAmount > 0) ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                        return (
                            <Card key={goal.id} className="group relative">
                                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(goal)} className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">
                                        <Pencil size={14} className="text-slate-500" />
                                    </button>
                                    <button onClick={() => handleDelete(goal.id)} className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50">
                                        <Trash2 size={14} className="text-red-500" />
                                    </button>
                                </div>
                                <div className="flex items-start gap-4">
                                     <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                                        {getGoalCategoryIcon(goal.category)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 pr-12">{goal.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Deadline: {formatDate(goal.deadline)}</p>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                     <div className="flex justify-between items-baseline">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(goal.currentAmount)}</span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400">of {formatCurrency(goal.targetAmount)}</span>
                                    </div>
                                    <ProgressBar value={goal.currentAmount} max={goal.targetAmount} colorClass="bg-stone-700" />
                                    <p className="text-right text-sm font-medium text-slate-600 dark:text-slate-300">{percentage.toFixed(2)}% Complete</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                 <Card className="text-center py-16 border-dashed border-2 hover:border-slate-400 transition-colors">
                    <Trophy className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">No goals yet</h3>
                    <p className="text-slate-500 mt-1 mb-6">Set a goal to start saving for something important.</p>
                    <button onClick={() => { setEditingGoal(null); setIsModalOpen(true); }} className="flex items-center gap-2 mx-auto px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300">
                        <PlusCircle size={16} /> Create First Goal
                    </button>
                </Card>
            )}
            <GoalModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                goal={editingGoal}
            />
        </div>
    );
};