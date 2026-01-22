
import React from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Target } from 'lucide-react';

export const GoalsPage: React.FC = () => {
    const { goals, loading } = useData();

    if (loading) {
        return <div className="text-center p-10">Loading goals...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Savings Goals</h2>
            {goals.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => {
                        const percentage = (goal.currentAmount / goal.targetAmount) * 100;
                        return (
                            <Card key={goal.id}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">{goal.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Deadline: {formatDate(goal.deadline)}</p>
                                    </div>
                                    <Target className="h-5 w-5 text-slate-400"/>
                                </div>
                                <div className="mt-4 space-y-2">
                                     <div className="flex justify-between items-baseline">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(goal.currentAmount)}</span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400">of {formatCurrency(goal.targetAmount)}</span>
                                    </div>
                                    <ProgressBar value={goal.currentAmount} max={goal.targetAmount} />
                                    <p className="text-right text-sm font-medium text-slate-600 dark:text-slate-300">{percentage.toFixed(2)}% Complete</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                 <Card className="text-center py-10">
                    <h3 className="text-lg font-semibold">No savings goals yet</h3>
                    <p className="text-slate-500 mt-1">Set a goal to start saving for something important.</p>
                    {/* Add goal creation button/modal here in a future version */}
                </Card>
            )}
        </div>
    );
};

// Dummy Lucide Icon
const createLucideIcon = (name: string) => {
    const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <title>{name}</title>
        </svg>
    );
    Icon.displayName = name;
    return Icon;
};

const Target = createLucideIcon('Target');
