
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

const getCategoryIcon = (category: string) => {
  const iconProps = { size: 14, className: "text-slate-500 dark:text-slate-400" };
  switch (category) {
    case 'Entertainment': return <Film {...iconProps} />;
    case 'Music': case 'Music Streaming': return <Headphones {...iconProps} />;
    case 'Productivity': case 'Task Management': return <Briefcase {...iconProps} />;
    case 'Design': case 'Art': return <PenTool {...iconProps} />;
    case 'Cloud Storage': case 'Hosting': return <Cloud {...iconProps} />;
    case 'Finance': case 'Banking': case 'Investing': return <DollarSign {...iconProps} />;
    case 'Video': case 'Video Streaming': return <Film {...iconProps} />;
    default: return <Layers {...iconProps} />;
  }
};

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

const ListView: React.FC<{
    data: Subscription[],
    onDelete: (id: string | number) => void,
    onEdit: (sub: Subscription) => void,
}> = ({ data, onDelete, onEdit }) => (
  <Card className="overflow-x-auto">
    <table className="min-w-full text-left">
      <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
        <tr>
          <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Service</th>
          <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
          <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Cost</th>
          <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Next Payment</th>
          <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
          <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
        {data.map((sub) => (
          <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800 transition-colors group">
            <td className="px-6 py-3.5 whitespace-nowrap">
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-xl p-1 flex items-center justify-center overflow-hidden border shadow-sm bg-white dark:bg-slate-700 border-gray-100 dark:border-slate-600">
                  <img src={getLogoUrl(sub)} alt={sub.name} className="h-full w-full object-contain" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40?text='+sub.name[0])} />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{sub.name}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-3.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(sub.category)}
                  <span className="truncate max-w-[100px]" title={sub.category}>{sub.category}</span>
                </div>
            </td>
            <td className="px-6 py-3.5 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                {formatCurrency(sub.price)} <span className="text-xs text-slate-400">/{sub.billingPeriod === 'Monthly' ? 'mo' : 'yr'}</span>
            </td>
            <td className="px-6 py-3.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                 {formatDateDisplay(sub.firstPayment)}
            </td>
            <td className="px-6 py-3.5 whitespace-nowrap">
                 <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${sub.status === 'Active' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/50' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700'}`}>
                   {sub.status}
                 </span>
            </td>
            <td className="px-6 py-3.5 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(sub)} className="p-1.5 rounded-md transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Edit size={16} />
                </button>
                <button onClick={() => onDelete(sub.id)} className="p-1.5 rounded-md transition-all text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30">
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

const GridView: React.FC<{
    data: Subscription[],
    onDelete: (id: string | number) => void,
    onEdit: (sub: Subscription) => void
}> = ({ data, onDelete, onEdit }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {data.map((sub) => (
      <Card key={sub.id} className="p-5 hover:shadow-md transition-all hover:-translate-y-0.5 relative group">
        <div className="flex justify-between items-start mb-3">
          <div className="h-12 w-12 rounded-xl p-1.5 border shadow-sm flex items-center justify-center bg-white dark:bg-slate-700 border-gray-100 dark:border-slate-600">
             <img src={getLogoUrl(sub)} alt={sub.name} className="h-full w-full object-contain" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40?text='+sub.name[0])} />
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 backdrop-blur-sm p-1 rounded-lg border shadow-sm bg-white/80 dark:bg-slate-900/80 border-gray-100 dark:border-slate-700">
             <button onClick={() => onEdit(sub)} className="p-1 text-slate-400 dark:hover:text-white hover:text-slate-900">
              <Edit size={14} />
            </button>
            <button onClick={() => onDelete(sub.id)} className="p-1 text-slate-400 dark:hover:text-red-400 hover:text-red-600">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <h3 className="text-base font-bold mb-0.5 truncate text-slate-900 dark:text-white">{sub.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
           {getCategoryIcon(sub.category)} <span className="truncate">{sub.category}</span>
        </p>
        <div className="flex items-end justify-between border-t pt-3 mt-1 border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Cost</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">{formatCurrency(sub.price)}</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
               {sub.expenseType === 'Recurring' ? 'Next Bill' : 'Date'}
             </p>
             <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
               {formatDateDisplay(sub.firstPayment)}
             </p>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const CalendarView: React.FC<{
    data: Subscription[],
    onEdit: (sub: Subscription) => void
}> = ({ data, onEdit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getSubsForDay = (day: number) => {
    return data.filter(sub => {
      if (sub.status !== 'Active' || !sub.firstPayment) return false;
      const paymentDate = new Date(sub.firstPayment);
      if (sub.expenseType === 'One-Time') {
        return paymentDate.getDate() === day && paymentDate.getMonth() === currentDate.getMonth() && paymentDate.getFullYear() === currentDate.getFullYear();
      }
      if (sub.billingPeriod === 'Monthly') return paymentDate.getDate() === day;
      if (sub.billingPeriod === 'Yearly') return paymentDate.getDate() === day && paymentDate.getMonth() === currentDate.getMonth();
      return false;
    });
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"><ChevronLeft size={18} /></button>
          <button onClick={() => setCurrentDate(new Date())} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600">Today</button>
          <button onClick={() => changeMonth(1)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"><ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px border dark:border-slate-700 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 text-slate-400">{d}</div>)}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="bg-white dark:bg-slate-800/50 h-28"></div>)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const daySubs = getSubsForDay(day);
          const total = daySubs.reduce((acc, sub) => acc + sub.price, 0);
          const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
          return (
            <div key={day} className={`bg-white dark:bg-slate-800/50 h-28 p-2 flex flex-col ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''}`}>
              <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-slate-900 dark:bg-blue-600 text-white' : ''}`}>{day}</span>
              <div className="flex-1 overflow-y-auto space-y-1 mt-1">
                {daySubs.map(sub => (
                  <div key={sub.id} onClick={() => onEdit(sub)} className="flex items-center gap-1.5 p-1 rounded-md border shadow-sm cursor-pointer bg-white dark:bg-slate-700 border-gray-100 dark:border-slate-600 hover:border-gray-300">
                    <img src={getLogoUrl(sub)} alt="" className="w-3 h-3 object-contain rounded-sm" onError={(e) => (e.currentTarget.style.display='none')} />
                    <span className="text-[9px] truncate w-full font-medium text-slate-700 dark:text-slate-300">{sub.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// --- Main Page Component ---
export const SubscriptionsPage: React.FC = () => {
    const { subscriptions, addSubscription, updateSubscription, deleteSubscription, loading } = useData();
    const [filters, setFilters] = useState({ status: 'All', expenseType: 'All' });
    const [viewMode, setViewMode] = useState('list');

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<Subscription | null>(null);
    const [subToDelete, setSubToDelete] = useState<Subscription | null>(null);

    const activeSubscriptions = useMemo(() => subscriptions.filter(s => s.status === 'Active' && s.expenseType === 'Recurring'), [subscriptions]);
    
    const filteredSubscriptions = useMemo(() => {
        return subscriptions
            .filter(sub => {
                if (filters.status !== 'All' && sub.status !== filters.status) return false;
                if (filters.expenseType !== 'All' && sub.expenseType !== filters.expenseType) return false;
                return true;
            })
            .sort((a, b) => new Date(b.firstPayment).getTime() - new Date(a.firstPayment).getTime());
    }, [subscriptions, filters]);

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
             let nextPayment = new Date(firstPayment); // clone date
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

    const handleEdit = (sub: Subscription) => {
        setEditingSub(sub);
        setAddModalOpen(true);
    };

    const handleDelete = (id: number | string) => {
        const sub = subscriptions.find(s => s.id === id);
        if (sub) setSubToDelete(sub);
    };

    const confirmDelete = () => {
        if (subToDelete) {
            deleteSubscription(subToDelete.id);
            setSubToDelete(null);
        }
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

            <div className="p-1 rounded-lg flex bg-slate-100 dark:bg-slate-800 w-min ml-auto">
                <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md transition-all text-sm flex items-center gap-2 ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}><List size={16} /> List</button>
                <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-md transition-all text-sm flex items-center gap-2 ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}><Grid size={16} /> Grid</button>
                <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 rounded-md transition-all text-sm flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}><CalendarIcon size={16} /> Calendar</button>
            </div>

            {viewMode === 'list' && <ListView data={filteredSubscriptions} onDelete={handleDelete} onEdit={handleEdit} />}
            {viewMode === 'grid' && <GridView data={filteredSubscriptions} onDelete={handleDelete} onEdit={handleEdit} />}
            {viewMode === 'calendar' && <CalendarView data={filteredSubscriptions} onEdit={handleEdit} />}
            
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
                        <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200/50 dark:shadow-red-800/50">Delete</button>
                    </div>
                 </div>
            </Modal>
        </div>
    );
};
