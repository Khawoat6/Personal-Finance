
import React, { useState, useMemo, useEffect } from 'react';
import type { Category } from '../../types';
import { X } from 'lucide-react';

interface BudgetCategorySelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedIds: Set<string>) => void;
    allCategories: Category[];
    activeCategoryIds: Set<string>;
}

interface BudgetItem {
    id: string;
    name: string;
    level: number;
    isLeaf: boolean;
}

export const BudgetCategorySelectorModal: React.FC<BudgetCategorySelectorModalProps> = ({ 
    isOpen, onClose, onSave, allCategories, activeCategoryIds 
}) => {
    const [selectedIds, setSelectedIds] = useState(activeCategoryIds);

    useEffect(() => {
        if (isOpen) {
            setSelectedIds(new Set(activeCategoryIds));
        }
    }, [isOpen, activeCategoryIds]);

    const categoryTree = useMemo(() => {
        const childMap = new Map<string, string[]>();
        allCategories.forEach(c => {
            if (c.parentCategoryId) {
                if (!childMap.has(c.parentCategoryId)) childMap.set(c.parentCategoryId, []);
                childMap.get(c.parentCategoryId)!.push(c.id);
            }
        });

        const flatList: BudgetItem[] = [];
        const buildFlatList = (categoryId: string, level: number) => {
            const category = allCategories.find(c => c.id === categoryId)!;
            const children = childMap.get(categoryId) || [];
            flatList.push({ id: category.id, name: category.name, level, isLeaf: children.length === 0 });
            children.forEach(childId => buildFlatList(childId, level + 1));
        };
        
        allCategories.filter(c => !c.parentCategoryId).forEach(c => buildFlatList(c.id, 0));
        return flatList;
    }, [allCategories]);

    const handleToggle = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSave = () => {
        onSave(selectedIds);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Select Budget Categories</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    {categoryTree.map(item => (
                        <div 
                            key={item.id} 
                            className="flex items-center" 
                            style={{ paddingLeft: `${item.level * 1.5}rem` }}
                        >
                            {item.isLeaf ? (
                                <label className="flex items-center cursor-pointer w-full group">
                                    <input 
                                        type="checkbox"
                                        checked={selectedIds.has(item.id)}
                                        onChange={() => handleToggle(item.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-500"
                                    />
                                    <span className="ml-3 text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">{item.name}</span>
                                </label>
                            ) : (
                                <span className={`text-sm font-semibold text-slate-800 dark:text-slate-200 ${item.level > 0 ? 'mt-2' : ''}`}>{item.name}</span>
                            )}
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-700 flex justify-end gap-2 sticky bottom-0">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-md hover:bg-slate-700 dark:hover:bg-slate-300">Save Selections</button>
                </div>
            </div>
        </div>
    );
};
