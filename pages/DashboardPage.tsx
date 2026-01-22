
import React, { useMemo, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

// New component for the insight text and buttons
const NetWorthInsight: React.FC = () => (
    <div className="mt-6 text-zinc-500 dark:text-slate-400 text-base space-y-4">
        <p>
            Investment performance helped as well, with your portfolio rising 1.7% — a gain of about ฿19,250. Tech holdings were a key driver, buoyed by a market rebound. Overall, a steady week of growth across the board.
        </p>
        <div className="flex items-center gap-4 pt-4 border-t border-zinc-200 dark:border-slate-700">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                <ThumbsUp size={16} /> More like this
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                <ThumbsDown size={16} /> Less like this
            </button>
        </div>
    </div>
);


const NetWorthChart: React.FC = () => {
    const { transactions, accounts } = useData();
    const timeRange = '1M'; 

    const chartData = useMemo(() => {
        const totalInitialBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        
        const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const dataPoints: { date: Date, balance: number }[] = [];
        let runningBalance = totalInitialBalance;

        // Start from the current balance at the current time
        dataPoints.push({ date: new Date(), balance: totalInitialBalance });
        
        // Go backwards in time, adjusting the balance
        for (let i = sortedTransactions.length - 1; i >= 0; i--) {
            const t = sortedTransactions[i];
            runningBalance = t.type === 'income' ? runningBalance - t.amount : runningBalance + t.amount;
            dataPoints.push({ date: new Date(t.date), balance: runningBalance });
        }
        
        dataPoints.sort((a, b) => a.date.getTime() - b.date.getTime());
        
        const now = new Date();
        let startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);
       
        const filteredPoints = dataPoints.filter(dp => dp.date >= startDate);
        const firstPointBeforeRange = dataPoints.filter(dp => dp.date < startDate).pop();

        if (firstPointBeforeRange && (filteredPoints.length === 0 || filteredPoints[0].date > firstPointBeforeRange.date)) {
           return [firstPointBeforeRange, ...filteredPoints];
        }
        
        return filteredPoints.length > 0 ? filteredPoints : [{date: new Date(), balance: totalInitialBalance}];
    }, [transactions, accounts, timeRange]);
    
    const netChange = useMemo(() => {
        if (chartData.length < 2) return { value: 0, percentage: 0 };
        const startValue = chartData[0].balance;
        const endValue = chartData[chartData.length - 1].balance;
        const change = endValue - startValue;
        const percentage = startValue !== 0 ? (change / startValue) * 100 : 0;
        return { value: change, percentage };
    }, [chartData]);
    
    const currentNetWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return (
         <Card className="dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900">
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-800 dark:text-slate-100">
                Your net worth {netChange.value >= 0 ? 'increased' : 'decreased'} by {formatCurrency(Math.abs(netChange.value))}
            </h2>
            
            <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-slate-700">
                <div className="flex justify-between items-baseline">
                    <div>
                         <h3 className="text-sm font-medium text-zinc-500 dark:text-slate-400 tracking-wider">NET WORTH</h3>
                         <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                             {formatCurrency(currentNetWorth)}
                         </p>
                    </div>
                    <p className={`text-lg font-medium ${netChange.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {netChange.value >= 0 ? '+' : ''}{netChange.percentage.toFixed(1)}%
                    </p>
                </div>
            </div>
            
            <div className="h-64 mt-4 -ml-6 -mr-6">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a3a3a3" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#a3a3a3" stopOpacity={0}/>
                            </linearGradient>
                             <linearGradient id="darkBalanceFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4b5563" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#4b5563" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{
                                backdropFilter: 'blur(4px)',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                            }}
                            formatter={(value: number) => [formatCurrency(value), 'Net Worth']}
                            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '3 3' }}
                        />
                        <Area type="monotone" dataKey="balance" stroke="rgb(100 116 139)" strokeWidth={2} fillOpacity={1} fill="url(#balanceFill)" className="dark:hidden" />
                        <Area type="monotone" dataKey="balance" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#darkBalanceFill)" className="hidden dark:block" />

                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <NetWorthInsight />
        </Card>
    );
};

export const DashboardPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const { loading } = useData();

    useEffect(() => {
        setHeaderActions(null);
        return () => setHeaderActions(null);
    }, [setHeaderActions]);

    if (loading) {
        return <div className="text-center p-10">Loading your financial dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <NetWorthChart />
        </div>
    );
};
