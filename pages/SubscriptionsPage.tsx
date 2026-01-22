
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../hooks/useData';
import type { Subscription } from '../types';
import { SUBSCRIPTION_CATEGORIES } from '../constants';
import { 
  Grid, List, Calendar as CalendarIcon, Plus, ChevronDown, Edit, Trash2, Eye,
  Film, Headphones, Briefcase, PenTool, Cloud, DollarSign, Layers, CreditCard,
  Smartphone, Wallet, ExternalLink, ChevronLeft, ChevronRight, X
} from 'lucide-react';

// --- Helpers ---
const getLogoUrl = (sub: Subscription) => {
  if (sub.logoUrl && sub.logoUrl.trim() !== '') return sub.logoUrl;
  const cleanName = sub.name.toLowerCase().replace(/\s/g, '');
  return `https://logo.clearbit.com/${cleanName}.com`;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);
};

const formatDateDisplay = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

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

const getPaymentMethodIcon = (method: string) => {
  const iconProps = { size: 14, className: "text-slate-500 dark:text-slate-400" };
  switch(method) {
    case 'Credit Card': return <CreditCard {...iconProps} />;
    case 'Mobile Banking': return <Smartphone {...iconProps} />;
    case 'e-Wallet': return <Wallet {...iconProps} />;
    case 'Cash': return <DollarSign {...iconProps} />;
    default: return <CreditCard {...iconProps} />;
  }
}

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
  <div className="bg-white dark:bg-slate-800/50 border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm border overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
          <tr>
            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Service</th>
            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Cost</th>
            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Next / First</th>
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
                  {formatCurrency(sub.price)}
              </td>
              <td className="px-6 py-3.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono text-xs">
                   {sub.firstPayment ? formatDateDisplay(sub.firstPayment) : '-'}
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
    </div>
  </div>
);

const GridView: React.FC<{
    data: Subscription[],
    onDelete: (id: string | number) => void,
    onEdit: (sub: Subscription) => void
}> = ({ data, onDelete, onEdit }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {data.map((sub) => (
      <div key={sub.id} className="bg-white dark:bg-slate-800/50 border-gray-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm border hover:shadow-md transition-all hover:-translate-y-0.5 relative group">
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
               {sub.firstPayment ? formatDateDisplay(sub.firstPayment) : '-'}
             </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const CalendarView: React.FC<{
    data: Subscription[],
    onEdit: (sub: Subscription) => void
}> = ({ data, onEdit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sunday
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getSubsForDay = (day: number) => {
    return data.filter(sub => {
      if (sub.status !== 'Active' || !sub.firstPayment) return false;
      const firstPaymentDate = new Date(sub.firstPayment);
      const startDay = firstPaymentDate.getDate();
      const startMonth = firstPaymentDate.getMonth();
      const startYear = firstPaymentDate.getFullYear();

      if (sub.expenseType === 'One-Time') {
        return startDay === day && startMonth === currentDate.getMonth() && startYear === currentDate.getFullYear();
      }
      if (sub.billingPeriod === 'Monthly') return startDay === day;
      if (sub.billingPeriod === 'Yearly') return startDay === day && startMonth === currentDate.getMonth();
      return false;
    });
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300">
            Today
          </button>
          <button onClick={() => changeMonth(1)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px border dark:border-slate-700 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
            {d}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-white dark:bg-slate-800/50 h-24 sm:h-28"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const daySubs = getSubsForDay(day);
          const total = daySubs.reduce((acc, sub) => acc + sub.price, 0);
          const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div key={day} className={`bg-white dark:bg-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/50 h-24 sm:h-28 p-2 relative group transition-colors flex flex-col ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''}`}>
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-slate-900 dark:bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-400'}`}>
                  {day}
                </span>
                {total > 0 && <span className="text-[10px] font-bold text-slate-900 dark:text-slate-300">฿{formatCurrency(total).replace('฿', '')}</span>}
              </div>
              <div className="flex-1 overflow-y-auto space-y-1">
                {daySubs.map(sub => (
                  <div key={sub.id} onClick={() => onEdit(sub)} className="flex items-center gap-1.5 p-1 rounded-md border shadow-sm cursor-pointer transition-colors bg-white dark:bg-slate-700 border-gray-100 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500">
                    <img src={getLogoUrl(sub)} alt="" className="w-3 h-3 object-contain rounded-sm" onError={(e) => (e.currentTarget.style.display='none')} />
                    <span className="text-[9px] truncate w-full font-medium text-slate-700 dark:text-slate-300">{sub.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Main Page Component ---
export const SubscriptionsPage: React.FC = () => {
    const { subscriptions, addSubscription, updateSubscription, deleteSubscription, loading } = useData();
    const [viewMode, setViewMode] = useState('list');
    const [filters, setFilters] = useState({ status: 'All', billingPeriod: 'All', expenseType: 'All' });

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<Subscription | null>(null);
    const [subToDelete, setSubToDelete] = useState<Subscription | null>(null);

    const filteredSubscriptions = useMemo(() => {
        return subscriptions
            .filter(sub => {
                if (filters.status !== 'All' && sub.status !== filters.status) return false;
                if (filters.billingPeriod !== 'All' && sub.billingPeriod !== filters.billingPeriod) return false;
                if (filters.expenseType !== 'All' && sub.expenseType !== filters.expenseType) return false;
                return true;
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [subscriptions, filters]);

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
        return <div className="text-center p-10">Loading your subscriptions...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                            className="appearance-none pl-3 pr-8 py-2 border rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-sm cursor-pointer bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                       <select 
                         value={filters.expenseType}
                         onChange={(e) => setFilters({...filters, expenseType: e.target.value})}
                         className="appearance-none pl-3 pr-8 py-2 border rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-sm cursor-pointer bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                       >
                         <option value="All">All Types</option>
                         <option value="Recurring">Recurring</option>
                         <option value="One-Time">One-Time</option>
                       </select>
                       <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
                     </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg flex bg-slate-100 dark:bg-slate-800">
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'}`}><List size={16} /></button>
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'}`}><Grid size={16} /></button>
                        <button onClick={() => setViewMode('calendar')} className={`p-1.5 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'}`}><CalendarIcon size={16} /></button>
                    </div>
                    <button onClick={handleAdd} className="px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-300">
                        <Plus size={16} className="mr-2" /> Add
                    </button>
                </div>
            </div>

            {/* Views */}
            {viewMode === 'list' && <ListView data={filteredSubscriptions} onDelete={handleDelete} onEdit={handleEdit} />}
            {viewMode === 'grid' && <GridView data={filteredSubscriptions} onDelete={handleDelete} onEdit={handleEdit} />}
            {viewMode === 'calendar' && <CalendarView data={filteredSubscriptions} onEdit={handleEdit} />}
            
            {/* Modals */}
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
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 shadow-sm">
                        <Trash2 size={24} />
                    </div>
                    <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Delete Subscription?</h4>
                    <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        Are you sure you want to delete this subscription? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <button onClick={() => setSubToDelete(null)} className="flex-1 py-2.5 border rounded-xl font-medium transition-colors bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                            Cancel
                        </button>
                        <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200/50 dark:shadow-red-800/50 transition-colors">
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// --- Add/Edit Modal Form ---
const SubscriptionFormModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    onSave: (sub: Omit<Subscription, 'id'>) => void,
    subscription: Subscription | null
}> = ({ isOpen, onClose, onSave, subscription }) => {
    
    const getTodayString = () => new Date().toISOString().split('T')[0];

    const initialFormState = {
        name: '', category: 'Entertainment', price: 0, expenseType: 'Recurring' as 'Recurring' | 'One-Time', 
        billingPeriod: 'Monthly' as 'Monthly' | 'Yearly', billingDay: 1, firstPayment: getTodayString(),
        endDate: '', paymentMethod: 'Credit Card', website: '', status: 'Active' as 'Active' | 'Inactive', logoUrl: ''
      };

    const [formState, setFormState] = useState(initialFormState);

    useEffect(() => {
        if(isOpen) {
            setFormState(subscription ? { ...subscription, price: Number(subscription.price) } : initialFormState);
        }
    }, [isOpen, subscription]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: name === 'price' || name === 'billingDay' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={subscription ? "Edit Subscription" : "Add New Subscription"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-400">Service Name</label>
                        <input required name="name" type="text" placeholder="e.g. Netflix" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-all bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-slate-400 dark:focus:border-slate-500" value={formState.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-400">Cost (THB)</label>
                        <input required name="price" type="number" placeholder="0.00" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-all bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-slate-400 dark:focus:border-slate-500" value={formState.price} onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-400">Category</label>
                    <select name="category" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" value={formState.category} onChange={handleChange}>
                        {SUBSCRIPTION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-400">First Payment Date</label>
                        <input name="firstPayment" type="date" required className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" value={formState.firstPayment} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-400">Status</label>
                        <select name="status" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" value={formState.status} onChange={handleChange}>
                            <option>Active</option><option>Inactive</option>
                        </select>
                    </div>
                </div>
                <div className="pt-4 border-t flex items-center justify-end border-slate-200 dark:border-slate-800">
                    <button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-300">
                        {subscription ? 'Save Changes' : 'Add Subscription'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
