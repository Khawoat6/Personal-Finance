
import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Trophy, PlusCircle, Pencil, Trash2, Plane, Laptop, ShoppingBag, Home, GraduationCap, Landmark, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { GoalModal } from '../components/features/GoalModal';
import { ContributeModal } from '../components/features/ContributeModal';
import { GoogleGenAI, Type } from '@google/genai';
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

type AISuggestion = Omit<Goal, 'id' | 'currentAmount'>;


export const GoalsPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const { goals, deleteGoal, loading } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    const [isContributeModalOpen, setContributeModalOpen] = useState(false);
    const [selectedGoalForContribute, setSelectedGoalForContribute] = useState<Goal | null>(null);

    const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    
    const handleAiSuggestions = async () => {
        setIsSuggesting(true);
        setAiSuggestions([]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const GOAL_CATEGORIES = ["Travel", "Technology", "Major Purchase", "Home Improvement", "Education", "Financial", "Other"];
            const schema = {
                type: Type.OBJECT,
                properties: {
                    goals: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                targetAmount: { type: Type.NUMBER },
                                category: { type: Type.STRING, enum: GOAL_CATEGORIES },
                            },
                            required: ["name", "targetAmount", "category"],
                        }
                    }
                },
                required: ["goals"]
            };

            const prompt = `Suggest three distinct and common personal finance goals for someone in their late 20s. For each goal, provide a name, a realistic targetAmount in THB, and a category from this list: ${GOAL_CATEGORIES.join(', ')}.`;
            
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });
            
            const result = JSON.parse(response.text ?? '{"goals":[]}');
            const suggestedGoals = result.goals.map((g: any) => ({
                ...g,
                deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // Default 1 year deadline
            }));
            setAiSuggestions(suggestedGoals);

        } catch (error) {
            console.error("AI suggestion failed:", error);
            alert("Could not fetch AI suggestions. Please check your API key.");
        } finally {
            setIsSuggesting(false);
        }
    };

    useEffect(() => {
        setHeaderActions(
            <div className="flex items-center gap-2">
                <button
                    onClick={handleAiSuggestions}
                    disabled={isSuggesting}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-stone-700 rounded-lg hover:bg-stone-600 disabled:bg-stone-400 dark:disabled:bg-stone-600 transition-colors"
                >
                    <Sparkles size={16} />
                    {isSuggesting ? 'Thinking...' : 'Suggest Goals'}
                </button>
                <button
                    onClick={() => { setEditingGoal(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300"
                >
                    <PlusCircle className="h-4 w-4" />
                    <span>New Goal</span>
                </button>
            </div>
        );
        return () => setHeaderActions(null);
    }, [setHeaderActions, isSuggesting]);

    const handleEdit = (goal: Goal) => {
        setEditingGoal(goal);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            await deleteGoal(id);
        }
    };

    const handleOpenContributeModal = (goal: Goal) => {
        setSelectedGoalForContribute(goal);
        setContributeModalOpen(true);
    };
    
    const handleUseSuggestion = (suggestion: AISuggestion) => {
        setEditingGoal({
            ...suggestion,
            id: '', // This will be treated as a new goal
            currentAmount: 0,
        });
        setIsModalOpen(true);
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
                        const isCompleted = goal.currentAmount >= goal.targetAmount;
                        const percentage = (goal.targetAmount > 0) ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100) : 0;
                        return (
                            <Card key={goal.id} className="group relative flex flex-col">
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
                                <div className="mt-4 space-y-2 flex-grow">
                                     <div className="flex justify-between items-baseline">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(goal.currentAmount)}</span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400">of {formatCurrency(goal.targetAmount)}</span>
                                    </div>
                                    <ProgressBar value={goal.currentAmount} max={goal.targetAmount} colorClass={isCompleted ? "bg-green-500" : "bg-stone-700"} />
                                </div>
                                <div className="mt-auto pt-4 flex items-center justify-between">
                                    {isCompleted ? (
                                        <div className="flex items-center gap-2 text-green-600 font-semibold text-sm py-2 px-3 rounded-lg bg-green-50 dark:bg-green-900/30">
                                            <CheckCircle2 size={16} />
                                            <span>Completed!</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleOpenContributeModal(goal)}
                                            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                                        >
                                            Contribute
                                        </button>
                                    )}
                                    <p className="text-right text-sm font-medium text-slate-600 dark:text-slate-300">{percentage.toFixed(0)}%</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                !isSuggesting && aiSuggestions.length === 0 && (
                    <Card className="text-center py-16 border-dashed border-2 hover:border-slate-400 transition-colors">
                        <Trophy className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">No goals yet</h3>
                        <p className="text-slate-500 mt-1 mb-6">Set a goal to start saving, or get some ideas from our AI assistant.</p>
                        <button onClick={() => { setEditingGoal(null); setIsModalOpen(true); }} className="flex items-center gap-2 mx-auto px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300">
                            <PlusCircle size={16} /> Create First Goal
                        </button>
                    </Card>
                )
            )}
            
            {(isSuggesting || aiSuggestions.length > 0) && (
                <Card>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">AI Suggested Goals</h3>
                    {isSuggesting && aiSuggestions.length === 0 && <p className="text-center text-slate-500 dark:text-slate-400 animate-pulse py-4">Generating creative savings ideas for you...</p>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {aiSuggestions.map((suggestion, index) => (
                            <div key={index} className="p-4 border dark:border-slate-700 rounded-lg hover:shadow-lg hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-all flex flex-col" onClick={() => handleUseSuggestion(suggestion)}>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                                        {getGoalCategoryIcon(suggestion.category)}
                                    </div>
                                    <h5 className="font-semibold text-slate-800 dark:text-slate-200">{suggestion.name}</h5>
                                </div>
                                <div className="mt-auto pt-3 text-center">
                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{formatCurrency(suggestion.targetAmount)}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{suggestion.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <GoalModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                goal={editingGoal}
            />
            <ContributeModal
                isOpen={isContributeModalOpen}
                onClose={() => setContributeModalOpen(false)}
                goal={selectedGoalForContribute}
            />
        </div>
    );
};
