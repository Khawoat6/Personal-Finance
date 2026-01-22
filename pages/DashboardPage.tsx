
import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlusCircle } from 'lucide-react';

const NetWorthChart: React.FC = () => {
    const { transactions, accounts } = useData();
    const [timeRange, setTimeRange] = useState('1M');

    const chartData = useMemo(() => {
        const totalInitialBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        
        const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const balanceAtEndDate = sortedTransactions.reduce((balance, t) => {
            return t.type === 'income' ? balance - t.amount : balance + t.amount;
        }, totalInitialBalance);

        const dataPoints: { date: Date, balance: number }[] = [];
        let currentBalance = balanceAtEndDate;
        dataPoints.push({ date: new Date(), balance: totalInitialBalance });

        let runningBalance = totalInitialBalance;
        for (let i = sortedTransactions.length - 1; i >= 0; i--) {
            const t = sortedTransactions[i];
            runningBalance = t.type === 'income' ? runningBalance - t.amount : runningBalance + t.amount;
            dataPoints.push({ date: new Date(t.date), balance: runningBalance });
        }
        
        dataPoints.sort((a, b) => a.date.getTime() - b.date.getTime());
        
        const now = new Date();
        let startDate = new Date();
        switch(timeRange) {
            case '1W': startDate.setDate(now.getDate() - 7); break;
            case '1M': startDate.setMonth(now.getMonth() - 1); break;
            case '3M': startDate.setMonth(now.getMonth() - 3); break;
            case 'YTD': startDate = new Date(now.getFullYear(), 0, 1); break;
            case 'ALL': startDate = dataPoints.length > 0 ? dataPoints[0].date : new Date(); break;
            default: startDate.setMonth(now.getMonth() - 1);
        }

        return dataPoints.filter(dp => dp.date >= startDate);

    }, [transactions, accounts, timeRange]);
    
    const netChange = useMemo(() => {
        if (chartData.length < 2) return { value: 0, percentage: 0 };
        const startValue = chartData[0].balance;
        const endValue = chartData[chartData.length - 1].balance;
        const change = endValue - startValue;
        const percentage = startValue !== 0 ? (change / startValue) * 100 : 0;
        return { value: change, percentage };
    }, [chartData]);


    const TimeRangeButton: React.FC<{ range: string }> = ({ range }) => (
        <button 
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${timeRange === range ? 'bg-zinc-200 dark:bg-slate-700 text-zinc-900 dark:text-slate-100' : 'text-zinc-500 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-slate-800'}`}
        >
            {range}
        </button>
    );

    return (
         <Card>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-slate-400 tracking-wider">NET WORTH</h3>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-slate-100 mt-1">
                        {formatCurrency(accounts.reduce((sum, acc) => sum + acc.balance, 0))}
                    </p>
                    <p className={`text-sm font-medium ${netChange.value >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {netChange.value >= 0 ? '+' : ''}{formatCurrency(netChange.value)} ({netChange.percentage.toFixed(2)}%)
                    </p>
                </div>
                 <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-slate-800 transition-colors">
                    <PlusCircle size={20} className="text-zinc-600 dark:text-slate-400" />
                </button>
            </div>
            
            <div className="h-64 mt-6 -ml-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a8a29e" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#a8a29e" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid #e2e8f0',
                                borderRadius: '0.5rem'
                            }}
                            formatter={(value: number) => formatCurrency(value)}
                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <XAxis 
                            dataKey="date" 
                            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }}
                            dy={10}
                        />
                        <Area type="monotone" dataKey="balance" stroke="#a8a29e" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
             <div className="flex items-center justify-center gap-2 mt-4">
                <TimeRangeButton range="1W" />
                <TimeRangeButton range="1M" />
                <TimeRangeButton range="3M" />
                <TimeRangeButton range="YTD" />
                <TimeRangeButton range="ALL" />
             </div>
        </Card>
    );
};

export const DashboardPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const { loading } = useData();
    const [activeTab, setActiveTab] = useState('Overview');

    useEffect(() => {
        setHeaderActions(null);
        return () => setHeaderActions(null);
    }, [setHeaderActions]);

    if (loading) {
        return <div className="text-center p-10">Loading your financial dashboard...</div>;
    }

    const TabButton: React.FC<{ name: string }> = ({ name }) => (
         <button 
            onClick={() => setActiveTab(name)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === name ? 'bg-white dark:bg-slate-700 text-zinc-900 dark:text-slate-100 shadow-sm' : 'text-zinc-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/50'}`}
        >
            {name}
        </button>
    );

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Good evening, Phattaraphon</h1>

            <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-slate-800 w-fit">
                <TabButton name="Overview" />
                <TabButton name="Net worth" />
            </div>
            
            <NetWorthChart />
        </div>
    );
};
