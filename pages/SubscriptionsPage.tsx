
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../hooks/useData';
import type { Subscription } from '../types';
import { 
  Grid, List, Calendar as CalendarIcon, Plus, ChevronDown, Edit, Trash2,
  Film, Headphones, Briefcase, PenTool, Cloud, DollarSign, Layers, CreditCard,
  Smartphone, Wallet, ExternalLink, ChevronLeft, ChevronRight, X, Repeat, TrendingUp, TrendingDown,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { SubscriptionFormModal } from '../components/features/SubscriptionFormModal';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, YAxis, XAxis, CartesianGrid } from 'recharts';

// --- Helpers ---
const getLogoUrl = (sub: Subscription) => {
  if (sub.logoUrl && sub.logoUrl.trim() !== '') return sub.logoUrl;
  const cleanName = sub.name.toLowerCase().replace(/\s/g, '');
  return `https://logo.clearbit.com/${cleanName}.com`;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const formatDateDisplay = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const COLORS = ['#3b82f6', '#10b981', '#f97316', '#ef4444', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6'];

// --- Sub-Components ---

const Modal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    title: string,
    children: React.ReactNode,
    maxWidth?: string
}> = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all overflow-y-auto">
      <div className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full ${maxWidth} overflow-hidden animate-in fade-in zoom-in-95 duration-200 border my-8`}>
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200/50 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors p-1 rounded-full">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export const SubscriptionsPage: React.FC = () => {
    const { subscriptions, addSubscription, updateSubscription, deleteSubscription, loading } = useData();
    const [filters, setFilters] = useState({ status: 'All', expenseType: 'All' });

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<Subscription | null>(null);
    const [subToDelete, setSubToDelete] = useState<Subscription | null>(null);

    const activeSubscriptions = useMemo(() => subscriptions.filter(s => s.status === 'Active' && s.expenseType === 'Recurring'), [subscriptions]);
    
    const summaryCards = useMemo(() => {
        const monthlyTotal = activeSubscriptions.reduce((sum, sub) => sum + (sub.billingPeriod === 'Yearly' ? sub.price / 12 : sub.price), 0);
        const mostExpensive = activeSubscriptions.reduce((max, sub) => {
            const currentCost = sub.billingPeriod === 'Yearly' ? sub.price / 12 : sub.price;
            return currentCost > (max?.price ?? 0) ? { ...sub, price: currentCost } : max;
        }, { price: 0, name: '-' });
        const mostAffordable = activeSubscriptions.reduce((min, sub) => {
            const currentCost = sub.billingPeriod === 'Yearly' ? sub.price / 12 : sub.price;
            return currentCost < (min?.price ?? Infinity) ? { ...sub, price: currentCost } : min;
        }, { price: Infinity, name: '-' });

        return {
            activeItems: activeSubscriptions.length,
            avgMonthly: monthlyTotal,
            mostExpensive: mostExpensive,
            mostAffordable: mostAffordable.name === '-' ? { price: 0, name: '-' } : mostAffordable
        };
    }, [activeSubscriptions]);

    const spendingProjectionData = useMemo(() => {
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleString('en-US', { month: 'short' });
            let total = 0;
            activeSubscriptions.forEach(sub => {
                const firstPayment = new Date(sub.firstPayment);
                if (firstPayment <= date) {
                     total += sub.billingPeriod === 'Yearly' ? sub.price / 12 : sub.price;
                }
            });
            data.push({ name: monthName, Expenses: total });
        }
        return data;
    }, [activeSubscriptions]);
    
    const categoryBreakdownData = useMemo(() => {
        const categoryMap = new Map<string, number>();
        activeSubscriptions.forEach(sub => {
            const monthlyCost = sub.billingPeriod === 'Yearly' ? sub.price / 12 : sub.price;
            categoryMap.set(sub.category, (categoryMap.get(sub.category) || 0) + monthlyCost);
        });
        return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
    }, [activeSubscriptions]);

    const upcomingPayments = useMemo(() => {
         return activeSubscriptions.map(sub => {
             const today = new Date();
             const firstPayment = new Date(sub.firstPayment);
             let nextPayment = firstPayment;
             if (sub.billingPeriod === 'Monthly') {
                 while (nextPayment < today) {
                     nextPayment.setMonth(nextPayment.getMonth() + 1);
                 }
             } else { // Yearly
                 while (nextPayment < today) {
                     nextPayment.setFullYear(nextPayment.getFullYear() + 1);
                 }
             }
             return { ...sub, nextPayment: nextPayment.toISOString() };
         }).sort((a,b) => new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime()).slice(0, 5);
    }, [activeSubscriptions]);
    
    const paymentMethods = useMemo(() => {
        const methodMap = new Map<string, { total: number, count: number }>();
        activeSubscriptions.forEach(sub => {
            const monthlyCost = sub.billingPeriod === 'Yearly' ? sub.price / 12 : sub.price;
            const current = methodMap.get(sub.paymentMethod) || { total: 0, count: 0 };
            methodMap.set(sub.paymentMethod, { total: current.total + monthlyCost, count: current.count + 1});
        });
        return Array.from(methodMap.entries()).map(([name, data]) => ({ name, ...data }));
    }, [activeSubscriptions]);
    
    const handleAdd = () => {
        setEditingSub(null);
        setAddModalOpen(true);
    };

    if (loading) {
        return <div className="text-center p-10">Loading subscriptions...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500">Filter:</span>
                     <select value={filters.status} onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-sm">
                         <option value="All">All Status</option>
                         <option value="Active">Active</option>
                         <option value="Inactive">Inactive</option>
                     </select>
                     <select value={filters.expenseType} onChange={(e) => setFilters(prev => ({...prev, expenseType: e.target.value}))} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-sm">
                         <option value="All">All Types</option>
                         <option value="Recurring">Recurring</option>
                         <option value="One-Time">One-Time</option>
                     </select>
                </div>
                <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300">
                    <Plus className="h-4 w-4" /> Add Subscription
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <Card className="col-span-2 md:col-span-1"><h4 className="text-sm text-slate-500">Active Items</h4><p className="text-2xl font-bold">{summaryCards.activeItems}</p></Card>
                 <Card className="col-span-2 md:col-span-1"><h4 className="text-sm text-slate-500">Avg. Monthly Expenses</h4><p className="text-2xl font-bold">{formatCurrency(summaryCards.avgMonthly)}</p></Card>
                 <Card><div className="flex justify-between items-center"><h4 className="text-sm text-slate-500">Most Expensive</h4><TrendingUp className="text-red-500" size={18}/></div><p className="text-lg font-bold">{formatCurrency(summaryCards.mostExpensive.price)}</p><p className="text-xs text-slate-400 truncate">{summaryCards.mostExpensive.name}</p></Card>
                 <Card><div className="flex justify-between items-center"><h4 className="text-sm text-slate-500">Most Affordable</h4><TrendingDown className="text-green-500" size={18}/></div><p className="text-lg font-bold">{formatCurrency(summaryCards.mostAffordable.price)}</p><p className="text-xs text-slate-400 truncate">{summaryCards.mostAffordable.name}</p></Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Spending Projection</h3>
                     <ResponsiveContainer width="100%" height={300}>
                         <LineChart data={spendingProjectionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                             <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                             <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(Number(value))}/>
                             <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', borderRadius: '0.5rem' }}/>
                             <Line type="monotone" dataKey="Expenses" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
                         </LineChart>
                     </ResponsiveContainer>
                 </Card>
                 <Card>
                    <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <PieChart>
                            <Pie data={categoryBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} cornerRadius={5}>
                                {categoryBreakdownData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                             <Tooltip formatter={(value: number) => formatCurrency(value)} />
                             <Legend iconSize={10} wrapperStyle={{fontSize: "12px"}}/>
                         </PieChart>
                     </ResponsiveContainer>
                 </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                     <h3 className="text-lg font-semibold mb-4">Upcoming Payments</h3>
                     <div className="space-y-3">
                         {upcomingPayments.map(sub => (
                             <div key={sub.id} className="flex items-center justify-between text-sm">
                                 <div className="flex items-center gap-3">
                                     <img src={getLogoUrl(sub)} alt={sub.name} className="h-8 w-8 object-contain rounded-md border p-1 dark:bg-slate-700" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                     <div>
                                         <p className="font-medium">{sub.name}</p>
                                         <p className="text-xs text-slate-500">{sub.category}</p>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <p className="font-semibold">{formatCurrency(sub.price)}</p>
                                     <p className="text-xs text-slate-500">{formatDateDisplay(sub.nextPayment)}</p>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </Card>
                <Card>
                    <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                    <div className="space-y-4">
                        {paymentMethods.map(method => (
                             <div key={method.name}>
                                 <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">{method.name} <span className="text-xs text-slate-400">({method.count})</span></span>
                                    <span className="font-semibold">{formatCurrency(method.total)}<span className="text-xs text-slate-400">/mo</span></span>
                                 </div>
                                 <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                     <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(method.total / summaryCards.avgMonthly) * 100}%` }}></div>
                                 </div>
                             </div>
                        ))}
                    </div>
                </Card>
            </div>
            
            <SubscriptionFormModal 
                isOpen={isAddModalOpen} 
                onClose={() => setAddModalOpen(false)}
                onSave={async (subData) => {
                    if (editingSub) {
                        await updateSubscription({ ...editingSub, ...subData });
                    } else {
                        await addSubscription(subData);
                    }
                    setAddModalOpen(false);
                }}
                subscription={editingSub}
            />
            <Modal isOpen={!!subToDelete} onClose={() => setSubToDelete(null)} title="Confirm Delete" maxWidth="max-w-sm">
                 <div className="text-center pt-2">
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 shadow-sm"><Trash2 size={24} /></div>
                    <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Delete Subscription?</h4>
                    <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
                    <div className="flex gap-3">
                        <button onClick={() => setSubToDelete(null)} className="flex-1 py-2.5 border rounded-xl font-medium transition-colors bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                        <button onClick={() => { if(subToDelete) { deleteSubscription(subToDelete.id); setSubToDelete(null); } }} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200/50 dark:shadow-red-800/50">Delete</button>
                    </div>
                 </div>
            </Modal>
        </div>
    );
};
