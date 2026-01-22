
import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ReportRow {
    id: string;
    name: string;
    level: number;
    type: 'income' | 'expense' | 'summary';
    isParent: boolean;
    monthlyBudgets: number[];
    total: number;
}

export const PersonalStatementPage: React.FC = () => {
    const { categories, loading } = useData();
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [collapsedRows, setCollapsedRows] = useState<Set<string>>(new Set(['expenses-housing', 'expenses-transportation', 'expenses-health', 'expenses-subscriptions', 'taxes', 'expenses', 'investing', 'expenses-family', 'expenses-debt']));

    const toggleRow = (id: string) => {
        setCollapsedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const reportData = useMemo(() => {
        const categoryMap = new Map(categories.map(c => [c.id, { ...c, monthlyBudgets: c.monthlyBudgets || Array(12).fill(0) }]));
        const childMap = new Map<string, string[]>();
        categories.forEach(c => {
            if (c.parentCategoryId) {
                if (!childMap.has(c.parentCategoryId)) childMap.set(c.parentCategoryId, []);
                childMap.get(c.parentCategoryId)!.push(c.id);
            }
        });

        const calculateParentTotals = (categoryId: string): number[] => {
            const children = childMap.get(categoryId) || [];
            if (children.length === 0) {
                return categoryMap.get(categoryId)!.monthlyBudgets!;
            }
            const newMonthlyBudgets = Array(12).fill(0);
            children.forEach(childId => {
                const childBudgets = calculateParentTotals(childId);
                for (let i = 0; i < 12; i++) {
                    newMonthlyBudgets[i] += childBudgets[i];
                }
            });
            const category = categoryMap.get(categoryId)!;
            category.monthlyBudgets = newMonthlyBudgets;
            categoryMap.set(categoryId, category);
            return newMonthlyBudgets;
        };
        categories.filter(c => !c.parentCategoryId).forEach(c => calculateParentTotals(c.id));
        
        const finalReport: ReportRow[] = [];
        const buildFlatReport = (categoryId: string, level: number) => {
            const category = categoryMap.get(categoryId)!;
            const children = childMap.get(categoryId) || [];
            finalReport.push({
                id: category.id,
                name: category.name,
                level,
                type: category.type,
                isParent: children.length > 0,
                monthlyBudgets: category.monthlyBudgets!,
                total: category.monthlyBudgets!.reduce((a, b) => a + b, 0),
            });

            if (!collapsedRows.has(categoryId)) {
                children.forEach(childId => buildFlatReport(childId, level + 1));
            }
        };

        const createSummaryRow = (id: string, name: string, budgets: number[]): ReportRow => ({
            id, name, level: 0, type: 'summary', isParent: false,
            monthlyBudgets: budgets, total: budgets.reduce((a, b) => a + b, 0)
        });
        
        buildFlatReport('income', 0);
        buildFlatReport('taxes', 0);
        
        const incomeBudgets = categoryMap.get('income')!.monthlyBudgets!;
        const taxesBudgets = categoryMap.get('taxes')!.monthlyBudgets!;
        const afterTaxBudgets = incomeBudgets.map((v, i) => v - taxesBudgets[i]);
        finalReport.push(createSummaryRow('after-tax', '3. After Tax Income', afterTaxBudgets));
        
        buildFlatReport('saving', 0);
        buildFlatReport('investing', 0);
        buildFlatReport('expenses', 0);

        const savingBudgets = categoryMap.get('saving')!.monthlyBudgets!;
        const investingBudgets = categoryMap.get('investing')!.monthlyBudgets!;
        const expensesBudgets = categoryMap.get('expenses')!.monthlyBudgets!;
        const netCashFlowBudgets = afterTaxBudgets.map((v, i) => v - savingBudgets[i] - investingBudgets[i] - expensesBudgets[i]);
        finalReport.push(createSummaryRow('net-cash-flow', 'Net Monthly Cash Flow', netCashFlowBudgets));
        
        return finalReport;
    }, [categories, collapsedRows]);

    const months = Array.from({length: 12}, (_, i) => new Date(0, i).toLocaleString('en-US', {month: 'short'}));

    if (loading) return <div className="text-center p-10">Loading Statement...</div>;

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Yearly Budget Statement for {selectedYear}</h2>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This is a read-only report of your financial plan. To make changes, please visit the 'Budgets' page.</p>
            </Card>
            
            <Card className="overflow-x-auto">
                 <table className="w-full min-w-[1400px] text-sm text-left text-slate-600 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-2 py-3 w-[350px] sticky left-0 z-10 bg-slate-100 dark:bg-slate-700">Category</th>
                            {months.map(m => <th key={m} scope="col" className="px-2 py-3 text-right">{m}</th>)}
                            <th scope="col" className="px-2 py-3 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((row) => (
                            <tr key={row.id} className={`${row.type === 'summary' || row.level === 0 ? 'font-semibold' : ''} ${row.id === 'net-cash-flow' ? 'bg-blue-50 dark:bg-blue-900/40' : row.level > 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/50'} border-b border-slate-200 dark:border-slate-700`}>
                                <td className="px-2 py-2 font-medium text-slate-900 dark:text-slate-100 sticky left-0 z-10" style={{paddingLeft: `${row.level * 1.5 + 0.5}rem`, backgroundColor: 'inherit'}}>
                                    <div className="flex items-center">
                                    {row.isParent && (
                                        <button onClick={() => toggleRow(row.id)} className="mr-1 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                                            {collapsedRows.has(row.id) ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                                        </button>
                                    )}
                                    <span>{row.name}</span>
                                    </div>
                                </td>
                                {row.monthlyBudgets.map((value, i) => (
                                    <td key={i} className={`px-2 py-2 text-right ${value < 0 ? 'text-red-500' : ''}`}>
                                        {value === 0 ? '-' : formatCurrency(value, 'THB').replace('฿','')}
                                    </td>
                                ))}
                                <td className={`px-2 py-2 text-right font-bold ${row.total < 0 ? 'text-red-500' : ''}`}>
                                    {formatCurrency(row.total, 'THB').replace('฿','')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};
