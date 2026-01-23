import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import { HelpCircle, FileText, Gift, Heart, User } from 'lucide-react';

const taxBrackets = [
    { limit: 150000, rate: 0 },
    { limit: 300000, rate: 0.05 },
    { limit: 500000, rate: 0.10 },
    { limit: 750000, rate: 0.15 },
    { limit: 1000000, rate: 0.20 },
    { limit: 2000000, rate: 0.25 },
    { limit: 5000000, rate: 0.30 },
    { limit: Infinity, rate: 0.35 },
];

const calculateThaiTax = (taxableIncome: number) => {
    let tax = 0;
    let remainingIncome = taxableIncome;
    let previousLimit = 0;

    for (const bracket of taxBrackets) {
        if (remainingIncome <= 0) break;
        const taxableInBracket = Math.min(remainingIncome, bracket.limit - previousLimit);
        tax += taxableInBracket * bracket.rate;
        remainingIncome -= taxableInBracket;
        previousLimit = bracket.limit;
    }
    return tax;
};

const DeductionInput: React.FC<{
    label: string;
    value: number;
    setValue: (value: number) => void;
    max: number;
    info: string;
}> = ({ label, value, setValue, max, info }) => {
    const displayValue = isNaN(value) ? '' : value;

    return (
        <div>
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center">
                    {label}
                    <div className="group relative ml-1.5">
                        <HelpCircle size={14} className="text-slate-400" />
                        <div className="absolute bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {info}
                        </div>
                    </div>
                </label>
                <input
                    type="number"
                    value={displayValue}
                    onChange={(e) => setValue(Math.min(max, parseInt(e.target.value, 10) || 0))}
                    onBlur={(e) => { if(e.target.value === '') setValue(0) }}
                    className="w-32 text-right bg-transparent dark:bg-transparent border-b border-slate-300 dark:border-slate-600 focus:border-slate-500 dark:focus:border-slate-400 focus:outline-none p-1 rounded-sm transition-colors"
                    placeholder="0"
                    max={max}
                />
            </div>
            <input
                type="range"
                min="0"
                max={max}
                step={100}
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer mt-2"
            />
        </div>
    );
};

export const TaxPlanningPage: React.FC = () => {
    const [income, setIncome] = useState(1200000);
    const [deductions, setDeductions] = useState({
        personal: 60000,
        socialSecurity: 9000,
        lifeInsurance: 0,
        healthInsurance: 0,
        ssf: 0,
        rmf: 0,
        donation: 0,
    });
    
    const handleDeductionChange = (key: keyof typeof deductions, value: number) => {
        setDeductions(prev => ({ ...prev, [key]: value }));
    };

    const taxResult = useMemo(() => {
        const expenseDeduction = Math.min(income * 0.5, 100000);
        
        // SSF + RMF cap
        const ssf_rmf_limit = income * 0.30;
        const total_ssf_rmf = Math.min(deductions.ssf + deductions.rmf, ssf_rmf_limit, 500000);

        const totalAllowances = 
            deductions.personal +
            deductions.socialSecurity +
            Math.min(deductions.lifeInsurance + deductions.healthInsurance, 100000) +
            total_ssf_rmf;

        const incomeAfterDeductions = income - expenseDeduction - totalAllowances;
        const donationDeduction = Math.min(deductions.donation, incomeAfterDeductions * 0.10);
        
        const taxableIncome = Math.max(0, incomeAfterDeductions - donationDeduction);
        const totalTax = calculateThaiTax(taxableIncome);
        const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

        let highestBracket = 0;
        for (const bracket of taxBrackets) {
            if (taxableIncome > (bracket.limit === 150000 ? 0 : bracket.limit - taxBrackets[taxBrackets.indexOf(bracket)-1]?.limit + (taxBrackets.indexOf(bracket) > 1 ? taxBrackets[taxBrackets.indexOf(bracket)-1]?.limit : 0) )) {
                 if (taxableIncome > bracket.limit) {
                    highestBracket = bracket.rate * 100;
                 } else if (taxableIncome <= bracket.limit && taxableIncome > (taxBrackets[taxBrackets.indexOf(bracket)-1]?.limit ?? 0) ) {
                    highestBracket = bracket.rate * 100;
                    break;
                 }
            }
        }
        if (taxableIncome <= 150000) highestBracket = 0;


        return {
            taxableIncome,
            totalTax,
            effectiveRate,
            highestBracket,
        };
    }, [income, deductions]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Tax Planning</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Estimate your annual tax liability and explore potential deductions. This is a planning tool and not a substitute for professional tax advice.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Inputs Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold mb-4">Annual Income</h3>
                        <div>
                            <label htmlFor="income" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Gross Income (per year)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">THB</span>
                                <input
                                    id="income"
                                    type="number"
                                    value={income}
                                    onChange={(e) => setIncome(parseInt(e.target.value, 10) || 0)}
                                    className="w-full pl-12 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white dark:bg-slate-700"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold mb-4">Deductions & Allowances</h3>
                        <div className="space-y-6">
                             <DeductionInput label="Life Insurance" value={deductions.lifeInsurance} setValue={v => handleDeductionChange('lifeInsurance', v)} max={100000} info="Maximum deduction is ฿100,000. When combined with health insurance, the total cannot exceed ฿100,000." />
                             <DeductionInput label="Health Insurance" value={deductions.healthInsurance} setValue={v => handleDeductionChange('healthInsurance', v)} max={25000} info="Maximum deduction is ฿25,000. When combined with life insurance, the total cannot exceed ฿100,000." />
                             <DeductionInput label="SSF (Super Savings Fund)" value={deductions.ssf} setValue={v => handleDeductionChange('ssf', v)} max={200000} info="Maximum 30% of income, not exceeding ฿200,000. Total with RMF, PVD, etc. cannot exceed ฿500,000." />
                             <DeductionInput label="RMF (Retirement Mutual Fund)" value={deductions.rmf} setValue={v => handleDeductionChange('rmf', v)} max={500000} info="Maximum 30% of income, not exceeding ฿500,000. Total with SSF, PVD, etc. cannot exceed ฿500,000." />
                             <DeductionInput label="Donations" value={deductions.donation} setValue={v => handleDeductionChange('donation', v)} max={income * 0.1} info="Standard donation is deductible up to 10% of net income after all other deductions." />
                        </div>
                    </Card>
                </div>

                {/* Summary Column */}
                <div className="lg:col-span-1 space-y-6 sticky top-6">
                    <Card>
                        <h3 className="text-lg font-semibold mb-4">Tax Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Taxable Income</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(taxResult.taxableIncome)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t dark:border-slate-700">
                                <span className="text-lg font-medium text-slate-500 dark:text-slate-400">Estimated Tax</span>
                                <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">{formatCurrency(taxResult.totalTax)}</span>
                            </div>
                             <div className="flex justify-between pt-2">
                                <span className="text-slate-500 dark:text-slate-400">Effective Tax Rate</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{taxResult.effectiveRate.toFixed(2)}%</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Highest Tax Bracket</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{taxResult.highestBracket}%</span>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold mb-4">Tax Optimization</h3>
                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                            <li className="flex gap-3">
                                <Heart size={16} className="text-sky-500 mt-1 flex-shrink-0" />
                                <span>Maximize SSF/RMF contributions to lower taxable income and save for retirement.</span>
                            </li>
                             <li className="flex gap-3">
                                <FileText size={16} className="text-sky-500 mt-1 flex-shrink-0" />
                                <span>Utilize life and health insurance deductions for protection and tax benefits.</span>
                            </li>
                            <li className="flex gap-3">
                                <Gift size={16} className="text-sky-500 mt-1 flex-shrink-0" />
                                <span>Donations to eligible charities can reduce your tax burden while supporting causes you care about.</span>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};