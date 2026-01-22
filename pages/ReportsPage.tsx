
import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { formatCurrency, getMonthName } from '../utils/formatters';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#FF4560'];

export const ReportsPage: React.FC = () => {
    const { transactions, categories, loading } = useData();

    const expenseByCategoryData = useMemo(() => {
        const expenseMap = new Map<string, number>();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        transactions
            .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth)
            .forEach(t => {
                const currentAmount = expenseMap.get(t.categoryId) || 0;
                expenseMap.set(t.categoryId, currentAmount + t.amount);
            });

        return Array.from(expenseMap.entries()).map(([categoryId, amount]) => ({
            name: categories.find(c => c.id === categoryId)?.name || 'Uncategorized',
            value: amount,
        })).sort((a,b) => b.value - a.value);
    }, [transactions, categories]);

    const monthlyComparisonData = useMemo(() => {
        const data: { [key: string]: { month: string, income: number, expense: number } } = {};
        const monthCount = 6;
        const now = new Date();

        for (let i = monthCount - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            data[monthKey] = {
                month: getMonthName(date.getMonth()),
                income: 0,
                expense: 0,
            };
        }

        transactions.forEach(t => {
            const date = new Date(t.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            if (data[monthKey]) {
                if (t.type === 'income') {
                    data[monthKey].income += t.amount;
                } else {
                    data[monthKey].expense += t.amount;
                }
            }
        });

        return Object.values(data);
    }, [transactions]);
    
    if (loading) {
        return <div className="text-center p-10">Generating reports...</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Expense Breakdown (This Month)</h3>
                 <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={expenseByCategoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {expenseByCategoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend wrapperStyle={{fontSize: "14px"}}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>
             <Card>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Monthly Comparison</h3>
                 <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <BarChart data={monthlyComparisonData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="month" tick={{ fill: 'rgb(100 116 139)' }} fontSize={12} />
                            <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} tick={{ fill: 'rgb(100 116 139)' }} fontSize={12} />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend wrapperStyle={{fontSize: "14px"}}/>
                            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};
