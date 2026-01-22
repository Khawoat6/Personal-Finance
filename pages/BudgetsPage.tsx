
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import type { Category } from '../types';
import { BudgetCategorySelectorModal } from '../components/features/BudgetCategorySelectorModal';

// A controlled input component for the budget amount
const BudgetInput: React.FC<{
    category: Category;
    onUpdate: (category: Category, newValue: number) => void;
}> = ({ category, onUpdate }) => {
    const initialValue = category.monthlyBudgets?.[0] || 0;
    const [localValue, setLocalValue] = React.useState(String(initialValue));
    
    const handleBlur = () => {
        const newValue = parseFloat(localValue);
        if (!isNaN(newValue) && newValue !== initialValue) {
            onUpdate(category, newValue);
        } else if (isNaN(newValue) && initialValue !== 0) {
            onUpdate(category, 0);
            setLocalValue('0');
        } else {
            setLocalValue(String(initialValue));
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        else if (e.key === 'Escape') {
            setLocalValue(String(initialValue));
            (e.target as HTMLInputElement).blur();
        }
    };
    
    useEffect(() => {
        setLocalValue(String(category.monthlyBudgets?.[0] || 0));
    }, [category.monthlyBudgets]);

    return (
        <input
            type="number" step="0.01" value={localValue}
            onChange={e => setLocalValue(e.target.value)}
            onBlur={handleBlur} onKeyDown={handleKeyDown}
            placeholder="0.00"
            className="w-32 text-right bg-transparent dark:bg-transparent border-b border-slate-300 dark:border-slate-600 focus:border-slate-500 dark:focus:border-slate-400 focus:outline-none p-1 rounded-sm transition-colors"
            aria-label={`Budget for ${category.name}`}
        />
    );
};

interface BudgetItem {
    id: string;
    name: string;
    level: number;
    isParent: boolean;
    isLeaf: boolean;
    budget: number;
    category: Category;
}

export const BudgetsPage: React.FC = () => {
    const { categories, updateCategory, loading } = useData();
    const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (categories.length > 0) {
            const initialActive = new Set<string>();
            categories.forEach(c => {
                if ((c.monthlyBudgets?.[0] || 0) !== 0) {
                    initialActive.add(c.id);
                }
            });
            setActiveCategories(initialActive);
        }
    }, [categories]);

    const handleBudgetUpdate = useCallback((category: Category, newValue: number) => {
        const newBudgets = Array(12).fill(newValue);
        updateCategory({ ...category, monthlyBudgets: newBudgets });
    }, [updateCategory]);

    const handleSaveSelection = (newSelectedIds: Set<string>) => {
        const deselected = categories.filter(c => 
            activeCategories.has(c.id) && !newSelectedIds.has(c.id)
        );
        deselected.forEach(cat => {
            if ((cat.monthlyBudgets?.[0] || 0) !== 0) {
                handleBudgetUpdate(cat, 0);
            }
        });
        setActiveCategories(newSelectedIds);
        setIsModalOpen(false);
    };
    
    const { visibleBudgetItems, summary } = useMemo(() => {
        const categoryMap = new Map(categories.map(c => [c.id, { ...c }]));
        const childMap = new Map<string, string[]>();
        categories.forEach(c => {
            if (c.parentCategoryId) {
                if (!childMap.has(c.parentCategoryId)) childMap.set(c.parentCategoryId, []);
                childMap.get(c.parentCategoryId)!.push(c.id);
            }
        });
        const isLeaf = (catId: string) => !childMap.has(catId);
        const calculateParentTotals = (categoryId: string): number => {
            if (isLeaf(categoryId)) return categoryMap.get(categoryId)!.monthlyBudgets?.[0] || 0;
            return (childMap.get(categoryId) || []).reduce((sum, childId) => sum + calculateParentTotals(childId), 0);
        };
        const fullBudgetItems: BudgetItem[] = [];
        const buildFlatList = (categoryId: string, level: number) => {
            const category = categoryMap.get(categoryId)!;
            const leaf = isLeaf(categoryId);
            fullBudgetItems.push({
                id: category.id, name: category.name, level, isParent: !leaf, isLeaf: leaf,
                budget: leaf ? (category.monthlyBudgets?.[0] || 0) : calculateParentTotals(categoryId),
                category
            });
            (childMap.get(categoryId) || []).forEach(childId => buildFlatList(childId, level + 1));
        };
        categories.filter(c => !c.parentCategoryId).forEach(c => buildFlatList(c.id, 0));

        const parentIdsToShow = new Set<string>();
        categories.forEach(cat => {
            if (activeCategories.has(cat.id)) {
                let current = cat;
                while (current.parentCategoryId) {
                    parentIdsToShow.add(current.parentCategoryId);
                    const parent = categoryMap.get(current.parentCategoryId);
                    if (!parent) break; current = parent;
                }
            }
        });
        const visibleItems = fullBudgetItems.filter(item => activeCategories.has(item.id) || parentIdsToShow.has(item.id));
        const totalIncome = calculateParentTotals('income');
        const totalExpense = ['expenses', 'taxes', 'saving', 'investing'].reduce((sum, id) => sum + (categoryMap.has(id) ? calculateParentTotals(id) : 0), 0);

        return { 
            visibleBudgetItems: visibleItems, 
            summary: { totalIncome, totalExpense, netFlow: totalIncome - totalExpense } 
        };
    }, [categories, activeCategories]);

    if (loading) return <div className="text-center p-10">Loading Budget Setup...</div>;
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <BudgetCategorySelectorModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveSelection}
                allCategories={categories}
                activeCategoryIds={activeCategories}
            />
            <div>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Monthly Budget Setup</h2>
                 <p className="text-slate-500 dark:text-slate-400 mt-1">
                     Select the categories you use, then enter your budget for the month.
                 </p>
            </div>
            
            <Card className="sticky top-4 z-20 backdrop-blur-lg bg-white/80 dark:bg-slate-800/80 shadow-md">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:divide-x md:dark:divide-slate-700">
                    <div className="px-2"><h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Monthly Income</h4><p className="text-xl font-semibold text-green-600 dark:text-green-400">{formatCurrency(summary.totalIncome)}</p></div>
                    <div className="px-2"><h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Monthly Expenses</h4><p className="text-xl font-semibold text-red-500 dark:text-red-400">{formatCurrency(summary.totalExpense)}</p></div>
                    <div className="px-2"><h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Projected Net Flow</h4><p className={`text-xl font-semibold ${summary.netFlow >= 0 ? 'text-slate-800 dark:text-slate-200' : 'text-red-500'}`}>{formatCurrency(summary.netFlow)}</p></div>
                </div>
            </Card>

            <Card>
                <div className="flex justify-end mb-4">
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300">
                        Select Categories
                    </button>
                </div>
                {visibleBudgetItems.length > 0 ? (
                    <div className="space-y-2">
                        {visibleBudgetItems.map(item => {
                            const isHeader = item.isParent && item.level < 2;
                            const isSubHeader = item.isParent && item.level >= 2;
                            return (
                                <div key={item.id} className={`flex items-center justify-between py-2 text-sm ${isHeader ? 'pt-4 pb-1 text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700' : isSubHeader ? 'mt-2 font-medium text-slate-700 dark:text-slate-300' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded'}`} style={{ paddingLeft: `${item.level * 1.25}rem` }}>
                                    <span className="pr-2">{item.name}</span>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {item.isLeaf ? (
                                            <BudgetInput category={item.category} onUpdate={handleBudgetUpdate} />
                                        ) : (
                                            <span className="w-32 text-right p-1 font-medium text-slate-500 dark:text-slate-400">{formatCurrency(item.budget)}</span>
                                        )}
                                        <span className="text-slate-400 dark:text-slate-500 text-xs w-12 text-left">/ month</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Your Budget is Empty</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Click "Select Categories" to start building your monthly budget.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};
