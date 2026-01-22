
import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownLeft, Wallet, Minus } from 'lucide-react';

export const DashboardPage: React.FC = () => {
    const { transactions, accounts, loading } = useData();

    const summary = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const currentMonthTransactions = transactions.filter(
            t => new Date(t.date) >= startOfMonth
        );

        const totalIncome = currentMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        
        const savingRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

        return { totalBalance, totalIncome, totalExpense, savingRate };
    }, [transactions, accounts]);

    const chartData = useMemo(() => {
        const data: { name: string; income: number; expense: number }[] = [];
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            data.push({ name: `${i}`, income: 0, expense: 0 });
        }

        transactions
            .filter(t => new Date(t.date).getMonth() === new Date().getMonth())
            .forEach(t => {
                const day = new Date(t.date).getDate() - 1;
                if (t.type === 'income') {
                    data[day].income += t.amount;
                } else {
                    data[day].expense += t.amount;
                }
            });

        return data.slice(0, new Date().getDate());
    }, [transactions]);


    if (loading) {
        return <div className="text-center p-10">Loading your financial dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Balance</h3>
                         <Wallet className="h-4 w-4 text-slate-400" />
                    </div>
                    <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrency(summary.totalBalance)}
                    </p>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                         <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">This Month's Income</h3>
                         <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="mt-1 text-2xl font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(summary.totalIncome)}
                    </p>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">This Month's Expense</h3>
                        <ArrowDownLeft className="h-4 w-4 text-red-500" />
                    </div>
                    <p className="mt-1 text-2xl font-semibold text-red-500 dark:text-red-400">
                        {formatCurrency(summary.totalExpense)}
                    </p>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Saving Rate</h3>
                        <Minus className="h-4 w-4 text-slate-400" />
                    </div>
                    <p className={`mt-1 text-2xl font-semibold ${summary.savingRate >= 0 ? 'text-slate-900 dark:text-slate-100' : 'text-red-500'}`}>
                        {summary.savingRate.toFixed(2)}%
                    </p>
                </Card>
            </div>
            
            <Card>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Monthly Trend</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="name" tick={{ fill: 'rgb(100 116 139)' }} fontSize={12} />
                            <YAxis tickFormatter={(value) => formatCurrency(Number(value), 'THB').replace('THB', '')} tick={{ fill: 'rgb(100 116 139)' }} fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.5rem'
                                }}
                                formatter={(value: number) => formatCurrency(value)}
                            />
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

// Dummy Lucide Icons
const createLucideIcon = (name: string) => {
    const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
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

const ArrowUpRight = createLucideIcon('ArrowUpRight');
const ArrowDownLeft = createLucideIcon('ArrowDownLeft');
const Wallet = createLucideIcon('Wallet');
const Minus = createLucideIcon('Minus');
