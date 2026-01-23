import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import { HeartPulse, PiggyBank, ShieldAlert, Scale, Info, TrendingUp, Target, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
// Fix: Added CartesianGrid to the import statement.
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 36; // r=36
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    let colorClass = 'text-red-500';
    if (score >= 80) colorClass = 'text-green-500';
    else if (score >= 60) colorClass = 'text-sky-500';
    else if (score >= 40) colorClass = 'text-yellow-500';

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 80 80">
                <circle className="text-slate-200 dark:text-slate-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="36" cx="40" cy="40"/>
                <circle
                    className={`${colorClass} transition-all duration-1000 ease-out`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="36"
                    cx="40"
                    cy="40"
                    transform="rotate(-90 40 40)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${colorClass}`}>{score}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">/ 100</span>
            </div>
        </div>
    );
};

const KeyMetricRow: React.FC<{
    icon: React.ElementType;
    title: string;
    value: string;
    status: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
}> = ({ icon: Icon, title, value, status }) => {
    const statusInfo = {
        'Excellent': { color: 'bg-green-500', icon: ArrowUpRight },
        'Good': { color: 'bg-sky-500', icon: ArrowUpRight },
        'Fair': { color: 'bg-yellow-500', icon: Minus },
        'Needs Improvement': { color: 'bg-red-500', icon: ArrowDownRight },
    };
    const { color, icon: StatusIcon } = statusInfo[status];

    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
                    <Icon size={18} className="text-slate-500 dark:text-slate-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{value}</span>
                <div className={`w-5 h-5 rounded-full ${color} flex items-center justify-center`}>
                    <StatusIcon size={12} className="text-white" />
                </div>
            </div>
        </div>
    );
};


const CustomTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{payload[0].name}</p>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100">{formatCurrency(payload[0].value)}</p>
            </div>
        );
    }
    return null;
};

export const FinancialHealthPage: React.FC = () => {
    const { transactions, categories, accounts, loading } = useData();

    const healthMetrics = useMemo(() => {
        const USER_AGE = 30; // Assume user age for calculations
        const last12Months = transactions.filter(t => new Date(t.date) > new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
        
        const annualIncome = last12Months.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const grossMonthlyIncome = annualIncome / 12;

        const totalToSaving = last12Months.filter(t => categories.find(c => c.id === t.categoryId)?.group === 'saving').reduce((sum, t) => sum + t.amount, 0);
        const totalToInvesting = last12Months.filter(t => categories.find(c => c.id === t.categoryId)?.group === 'investing').reduce((sum, t) => sum + t.amount, 0);
        const totalSavingsAndInvestments = totalToSaving + totalToInvesting;
        
        const savingsRate = annualIncome > 0 ? (totalSavingsAndInvestments / annualIncome) * 100 : 0;
        let savingsRateStatus: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' = 'Needs Improvement';
        if (savingsRate >= 20) savingsRateStatus = 'Excellent';
        else if (savingsRate >= 15) savingsRateStatus = 'Good';
        else if (savingsRate >= 10) savingsRateStatus = 'Fair';
        
        const investmentRate = annualIncome > 0 ? (totalToInvesting / annualIncome) * 100 : 0;
        let investmentRateStatus: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' = 'Needs Improvement';
        if (investmentRate >= 15) investmentRateStatus = 'Excellent';
        else if (investmentRate >= 10) investmentRateStatus = 'Good';
        else if (investmentRate >= 5) investmentRateStatus = 'Fair';

        const cashBalance = accounts.filter(a => a.name.toLowerCase().includes('cash') || a.name.toLowerCase().includes('bank')).reduce((sum, a) => sum + a.balance, 0);
        const essentialCategories = new Set(['expenses-housing', 'expenses-food', 'expenses-transportation', 'expenses-health', 'taxes']);
        const monthlyEssentialExpenses = last12Months.filter(t => {
            let cat = categories.find(c => c.id === t.categoryId); let isEssential = false;
            while (cat) { if (essentialCategories.has(cat.id)) { isEssential = true; break; } cat = categories.find(c => c.id === cat?.parentCategoryId); }
            return isEssential;
        }).reduce((sum, t) => sum + t.amount, 0) / 12;
        
        const emergencyFundMonths = monthlyEssentialExpenses > 0 ? cashBalance / monthlyEssentialExpenses : 0;
        let emergencyFundStatus: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' = 'Needs Improvement';
        if (emergencyFundMonths >= 6) emergencyFundStatus = 'Excellent';
        else if (emergencyFundMonths >= 3) emergencyFundStatus = 'Good';
        else if (emergencyFundMonths >= 1) emergencyFundStatus = 'Fair';
        
        const monthlyDebtPayments = last12Months.filter(t => t.categoryId.startsWith('expenses-debt')).reduce((sum, t) => sum + t.amount, 0) / 12;
        const dtiRatio = grossMonthlyIncome > 0 ? (monthlyDebtPayments / grossMonthlyIncome) * 100 : 0;
        let dtiStatus: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' = 'Excellent';
        if (dtiRatio > 43) dtiStatus = 'Needs Improvement';
        else if (dtiRatio > 36) dtiStatus = 'Fair';
        else if (dtiRatio > 15) dtiStatus = 'Good';
        
        const currentNetWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        const targetNetWorth = (USER_AGE * annualIncome) / 10;
        const netWorthProgress = targetNetWorth > 0 ? (currentNetWorth / targetNetWorth) * 100 : 0;
        let netWorthStatus: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' = 'Needs Improvement';
        if (netWorthProgress >= 100) netWorthStatus = 'Excellent';
        else if (netWorthProgress >= 75) netWorthStatus = 'Good';
        else if (netWorthProgress >= 50) netWorthStatus = 'Fair';

        const needsCats = new Set([...essentialCategories, 'expenses-family']);
        let needsTotal = 0, wantsTotal = 0, savingsTotal = 0;
        last12Months.filter(t => t.type === 'expense' && t.categoryId !== 'taxes-provident').forEach(t => {
            let cat = categories.find(c => c.id === t.categoryId); let catGroup = cat?.group; let parentCat = categories.find(c => c.id === cat?.parentCategoryId);
            if (catGroup === 'saving' || catGroup === 'investing') { savingsTotal += t.amount; return; }
            if (needsCats.has(t.categoryId) || needsCats.has(cat?.parentCategoryId ?? '')) { needsTotal += t.amount; return; }
            if (parentCat && needsCats.has(parentCat.parentCategoryId ?? '')) { needsTotal += t.amount; return; }
            wantsTotal += t.amount;
        });

        const totalSpending = needsTotal + wantsTotal + savingsTotal;
        const budget503020 = {
            needs: totalSpending > 0 ? (needsTotal / totalSpending) * 100 : 0,
            wants: totalSpending > 0 ? (wantsTotal / totalSpending) * 100 : 0,
            savings: totalSpending > 0 ? (savingsTotal / totalSpending) * 100 : 0,
        };

        const scoreMap = { 'Excellent': 100, 'Good': 75, 'Fair': 50, 'Needs Improvement': 25 };
        const totalScore = scoreMap[savingsRateStatus] + scoreMap[investmentRateStatus] + scoreMap[emergencyFundStatus] + scoreMap[dtiStatus] + scoreMap[netWorthStatus];
        const overallScore = Math.round(totalScore / 5);

        let scoreStatus = "Needs Improvement";
        let scoreSummary = "There are key areas to focus on. Start with building an emergency fund and increasing your savings rate.";
        if (overallScore >= 80) { scoreStatus = "Excellent"; scoreSummary = "You're in great financial shape! Continue to grow your investments and monitor your net worth to stay on track for long-term goals."; }
        else if (overallScore >= 60) { scoreStatus = "Good"; scoreSummary = "You have a solid foundation. Consider increasing your investment rate to accelerate wealth building."; }
        else if (overallScore >= 40) { scoreStatus = "Fair"; scoreSummary = "You're making progress. Focus on increasing savings and paying down high-interest debt to improve your score."; }

        return {
            savingsRate, savingsRateStatus, investmentRate, investmentRateStatus,
            emergencyFundMonths, emergencyFundStatus,
            dtiRatio, dtiStatus,
            currentNetWorth, targetNetWorth, netWorthProgress, netWorthStatus,
            budget503020,
            overallScore, scoreStatus, scoreSummary
        };
    }, [transactions, categories, accounts]);

    if (loading) return <div className="text-center p-10">Crafting your Financial Dashboard...</div>;

    const netWorthChartData = [{ name: 'Net Worth', current: healthMetrics.currentNetWorth, target: healthMetrics.targetNetWorth }];
    const spendingChartData = [
        { name: 'Needs', value: healthMetrics.budget503020.needs },
        { name: 'Wants', value: healthMetrics.budget503020.wants },
        { name: 'Savings', value: healthMetrics.budget503020.savings },
    ];
    const COLORS = ['#38bdf8', '#facc15', '#34d399'];


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Financial Health Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex items-center gap-4">
                            <ScoreGauge score={healthMetrics.overallScore} />
                            <div className="flex-1">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Overall Score</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{healthMetrics.scoreStatus}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{healthMetrics.scoreSummary}</p>
                            </div>
                        </div>
                    </Card>
                    <Card>
                         <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Key Metrics</h3>
                         <div className="space-y-1">
                             <KeyMetricRow icon={PiggyBank} title="Savings & Investment Rate" value={`${healthMetrics.savingsRate.toFixed(1)}%`} status={healthMetrics.savingsRateStatus} />
                             <KeyMetricRow icon={TrendingUp} title="Investment Rate" value={`${healthMetrics.investmentRate.toFixed(1)}%`} status={healthMetrics.investmentRateStatus} />
                             <KeyMetricRow icon={ShieldAlert} title="Emergency Fund" value={`${healthMetrics.emergencyFundMonths.toFixed(1)} mo`} status={healthMetrics.emergencyFundStatus} />
                             <KeyMetricRow icon={Scale} title="Debt-to-Income" value={`${healthMetrics.dtiRatio.toFixed(1)}%`} status={healthMetrics.dtiStatus} />
                         </div>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-3 space-y-6">
                    <Card>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Net Worth Progress</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Are you on track? This compares your current net worth to a target based on your age and income.</p>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={netWorthChartData} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                                <XAxis type="number" tickFormatter={(val) => `฿${val/1000}k`} fontSize={12} />
                                <YAxis type="category" dataKey="name" hide />
                                <Tooltip content={<CustomTooltipContent />} cursor={{fill: 'rgba(239, 239, 237, 0.5)'}} />
                                <Bar dataKey="current" name="Current Net Worth" fill="#475569" radius={[4, 4, 4, 4]} barSize={25} />
                                <Bar dataKey="target" name="Target Net Worth" fill="#a8a29e" radius={[4, 4, 4, 4]} barSize={25} />
                                <Legend wrapperStyle={{fontSize: "12px"}}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                    <Card>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Spending Breakdown (50/30/20)</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">How your spending aligns with the popular guideline for Needs, Wants, and Savings.</p>
                         <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={spendingChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {spendingChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                                <Legend wrapperStyle={{fontSize: "12px"}}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
        </div>
    );
};