import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useData } from '../hooks/useData';
import { formatCurrency } from '../utils/formatters';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot } from 'recharts';
import { Info, Pencil } from 'lucide-react';

const START_AGE = 30;
const END_AGE = 90;

const TabButton: React.FC<{ name: string; active: boolean; onClick: () => void }> = ({ name, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            active
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        }`}
    >
        {name}
    </button>
);

const MetricCard: React.FC<{ title: string; value: string; children: React.ReactNode }> = ({ title, value, children }) => (
    <div>
        <h4 className="text-sm text-slate-400">{title}</h4>
        <p className="text-4xl font-bold mt-2 text-white">{value}</p>
        <p className="text-xs text-slate-400 mt-2 max-w-xs">{children}</p>
    </div>
);

const EditableMetricCard: React.FC<{ title: string; value: number; onSave: (newValue: number) => void; children: React.ReactNode }> = ({ title, value, onSave, children }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(String((value * 100).toFixed(2)));
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isEditing) {
            setInputValue(String((value * 100).toFixed(2)));
        }
    }, [value, isEditing]);
    
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        const newRate = parseFloat(inputValue);
        if (!isNaN(newRate) && newRate >= 0 && newRate <= 100) {
            onSave(newRate / 100);
        } else {
            setInputValue(String((value * 100).toFixed(2))); // Reset if invalid
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            setInputValue(String((value * 100).toFixed(2)));
            setIsEditing(false);
        }
    };

    return (
        <div>
            <h4 className="text-sm text-slate-400">{title}</h4>
            <div className="flex items-baseline gap-2 mt-2 group cursor-pointer" onClick={() => !isEditing && setIsEditing(true)}>
                {isEditing ? (
                     <div className="relative">
                        <input
                            ref={inputRef}
                            type="number"
                            step="0.01"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            className="w-36 text-4xl font-bold bg-transparent text-white focus:outline-none focus:ring-2 ring-sky-500 rounded-md p-0 pr-8"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-4xl font-bold text-white pointer-events-none">%</span>
                     </div>
                ) : (
                    <>
                        <p className="text-4xl font-bold text-white">{(value * 100).toFixed(2)}%</p>
                        <Pencil size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                )}
            </div>
            <p className="text-xs text-slate-400 mt-2 max-w-xs">{children}</p>
        </div>
    );
};


const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/80 backdrop-blur-sm p-3 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-300">Age: {label}</p>
                <p className="text-base font-bold text-white">{`Net Worth: ${formatCurrency(payload[0].value)}`}</p>
            </div>
        );
    }
    return null;
};

export const ReportsPage: React.FC = () => {
    const { accounts, categories, loading } = useData();
    const [activeTab, setActiveTab] = useState('Net worth');
    
    const [annualReturn, setAnnualReturn] = useState(() => {
        const savedRate = localStorage.getItem('annualInvestmentReturnRate');
        return savedRate ? parseFloat(savedRate) : 0.0654; // Default to 6.54%
    });

    const handleReturnRateSave = (newRate: number) => {
        setAnnualReturn(newRate);
        localStorage.setItem('annualInvestmentReturnRate', String(newRate));
    };


    useEffect(() => {
        // Override main app background for this page
        document.body.className = 'bg-gradient-to-b from-[#0B1120] via-[#0F172A] to-[#1E293B]';
        // Cleanup on unmount
        return () => {
          document.body.className = 'bg-slate-50 dark:bg-slate-900';
        }
    }, []);

    const projectionData = useMemo(() => {
        if (loading) return { chartData: [], medianNetWorth: 0 };

        const currentNetWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);

        const annualIncome = categories
            .filter(c => c.type === 'income' && c.monthlyBudgets)
            .reduce((sum, c) => sum + (c.monthlyBudgets?.reduce((a, b) => a + b, 0) || 0), 0);
            
        const annualExpense = categories
            .filter(c => c.type === 'expense' && c.monthlyBudgets)
            .reduce((sum, c) => sum + (c.monthlyBudgets?.reduce((a, b) => a + b, 0) || 0), 0);
            
        const annualSavings = annualIncome - annualExpense;

        const data = [];
        let currentWorth = currentNetWorth;

        for (let age = START_AGE; age <= END_AGE; age++) {
            data.push({ age: age, netWorth: currentWorth });
            currentWorth = (currentWorth + (age < 65 ? annualSavings : 0)) * (1 + annualReturn);
        }
        
        const medianNetWorth = data.find(d => d.age === END_AGE)?.netWorth || 0;

        return { chartData: data, medianNetWorth };
    }, [accounts, categories, loading, annualReturn]);
    
    const yAxisFormatter = (value: number) => {
        if (value === 0) return '฿0';
        return `฿${value / 1000}K`;
    };

    const xAxisFormatter = (value: number) => {
        if (value === START_AGE) return 'TODAY';
        return `AGE ${value}`;
    };

    if (loading) {
        return <div className="text-center p-10 text-white">Projecting your future...</div>;
    }

    return (
        <div className="text-white">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-6xl font-serif">Project your success</h1>
                <p className="mt-4 text-lg text-slate-300">
                    See an instant projection of your net worth and cash flow based on your finances today and goals for tomorrow.
                </p>
            </div>

            <div className="mt-12 p-8 bg-slate-500/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                    <TabButton name="Net worth" active={activeTab === 'Net worth'} onClick={() => setActiveTab('Net worth')} />
                    <TabButton name="Cash flow" active={activeTab === 'Cash flow'} onClick={() => setActiveTab('Cash flow')} />
                    <TabButton name="Success %" active={activeTab === 'Success %'} onClick={() => setActiveTab('Success %')} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                    <MetricCard title="Chance of success at 90" value="85%">
                        After factoring in your events, you meet or exceed your target net worth in 85% of the simulations.
                    </MetricCard>
                    <MetricCard title="Median net worth at 90" value={formatCurrency(projectionData.medianNetWorth)}>
                        Most outcomes are concentrated around {formatCurrency(Math.round(projectionData.medianNetWorth / 100000) * 100000)}, which is the median result, making it a useful indicator of where you’re likely to land.
                    </MetricCard>
                     <EditableMetricCard
                        title="Projected average annual return"
                        value={annualReturn}
                        onSave={handleReturnRateSave}
                    >
                        Enter your expected annual return rate. This will affect your future net worth projection.
                    </EditableMetricCard>
                </div>

                <div className="h-[450px] mt-8 -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={projectionData.chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <defs>
                                <linearGradient id="projectionFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis 
                                dataKey="age" 
                                tickFormatter={xAxisFormatter}
                                ticks={[START_AGE, 50, 60, 70, 80, 90]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={yAxisFormatter}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                domain={[0, 'dataMax']}
                            />
                            <Tooltip content={<CustomTooltipContent />} cursor={{ stroke: 'rgba(56, 189, 248, 0.5)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                            <Area type="monotone" dataKey="netWorth" stroke="#38bdf8" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#projectionFill)" />
                            
                             <ReferenceDot x={START_AGE} y={projectionData.chartData[0]?.netWorth} r={5} fill="#38bdf8" stroke="white" strokeWidth={2}>
                                <foreignObject x={-60} y={-35} width="120" height="30">
                                   <div className="text-center p-1 rounded-full border border-slate-500 bg-slate-800/50 text-xs text-white">
                                       {formatCurrency(projectionData.chartData[0]?.netWorth)}
                                   </div>
                                </foreignObject>
                            </ReferenceDot>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
