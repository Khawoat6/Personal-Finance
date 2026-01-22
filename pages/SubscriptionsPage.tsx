
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useData } from '../hooks/useData';
import type { Subscription } from '../types';
import { 
  AppWindow, Rows3, CalendarDays, PlusSquare, ChevronDown, FilePenLine, Trash2,
  Clapperboard, Music2, Laptop, Paintbrush, CloudCog, BadgeDollarSign, Package, CreditCard,
  Wallet, WalletCards, ExternalLink, ChevronLeft, ChevronRight, X, TrendingUp,
  LayoutGrid, FileUp, FileDown, ChevronsUpDown, PiggyBank, CircleAlert
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { SubscriptionFormModal } from '../components/features/SubscriptionFormModal';
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

type SortableKeys = 'name' | 'price' | 'nextPayment';

// --- Helpers ---
const getLogoUrl = (sub: Subscription) => {
  if (sub.logoUrl && sub.logoUrl.trim() !== '') return sub.logoUrl;
  const cleanName = sub.name.toLowerCase().replace(/\s/g, '');
  return `https://logo.clearbit.com/${cleanName}.com`;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const formatCurrencyWithTHB = (amount: number) => {
    return `THB ${new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`;
};

const formatDateDisplay = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatDaysUntil = (days: number) => {
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `in ${days} days`;
};

const getCategoryIcon = (category: string) => {
  const iconProps = { size: 18, className: "text-slate-500 dark:text-slate-400" };
  switch (category) {
    case 'Entertainment': return <Clapperboard {...iconProps} />;
    case 'Music': case 'Music Streaming': return <Music2 {...iconProps} />;
    case 'Productivity': case 'Task Management': return <Laptop {...iconProps} />;
    case 'Design': case 'Art': return <Paintbrush {...iconProps} />;
    case 'Cloud Storage': case 'Hosting': return <CloudCog {...iconProps} />;
    case 'Finance': case 'Banking': case 'Investing': return <BadgeDollarSign {...iconProps} />;
    case 'Video': case 'Video Streaming': return <Clapperboard {...iconProps} />;
    default: return <Package {...iconProps} />;
  }
};

const getPaymentMethodIcon = (method: string) => {
    const iconProps = { size: 24, className: "text-slate-600 dark:text-slate-400" };
    switch (method.toLowerCase()) {
        case 'credit card': return <CreditCard {...iconProps} />;
        case 'debit card': return <WalletCards {...iconProps} />;
        default: return <Wallet {...iconProps} />;
    }
};


// --- Sub-Components ---
const FilterDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  title: string;
}> = ({ value, onChange, options, title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selectedLabel = options.find(o => o.value === value)?.label || title;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref]);

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full sm:w-auto gap-2 px-3 py-1.5 rounded-lg transition-all text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
               <span className="truncate">{selectedLabel}</span>
               <ChevronDown size={16} />
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border dark:border-slate-700 z-20 max-h-60 overflow-y-auto">
                    <div className="p-1">
                        {options.map(option => (
                            <button 
                                key={option.value} 
                                onClick={() => { onChange(option.value); setIsOpen(false); }}
                                className="flex items-center w-full px-2 py-1.5 text-sm rounded-md text-left hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = data.forecast ?? data.past;
    if (value === undefined || value === null) return null;

    return (
      <div className="p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg">
        <p className="label font-semibold text-slate-800 dark:text-slate-200">{`${label}`}</p>
        <p className="intro text-slate-600 dark:text-slate-400">{`Monthly Cost: ${formatCurrency(value)}`}</p>
      </div>
    );
  }

  return null;
};

const Switch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`${
            checked ? 'bg-slate-900 dark:bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
        } relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
    >
        <span
            aria-hidden="true"
            className={`${
                checked ? 'translate-x-4' : 'translate-x-0'
            } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);

const ColumnsDropdown: React.FC<{
    columns: { [key: string]: boolean },
    setColumns: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
}> = ({ columns, setColumns }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref]);

    const toggleColumn = (key: string) => {
        setColumns(prev => ({ ...prev, [key]: !prev[key] }));
    }

    const allColumns = [
        { key: 'category', label: 'Category' },
        { key: 'cost', label: 'Cost' },
        { key: 'billingPeriod', label: 'Billing Period' },
        { key: 'paymentMethod', label: 'Payment Method' },
        { key: 'nextPaymentDate', label: 'Next Payment Date' },
        { key: 'status', label: 'Status' },
        { key: 'endDate', label: 'End Date' },
        { key: 'website', label: 'Website' },
        { key: 'usage', label: 'Usage' },
    ];

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
               <LayoutGrid size={16} /> Columns <ChevronDown size={16} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border dark:border-slate-700 z-20">
                    <div className="p-2 space-y-1">
                        {allColumns.map(col => (
                            <label key={col.key} className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                                <span>{col.label}</span>
                                <Switch checked={columns[col.key]} onChange={() => toggleColumn(col.key)} />
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const ListView: React.FC<{
    data: (Subscription & { nextPayment: string })[],
    onDelete: (id: string | number) => void,
    onEdit: (sub: Subscription) => void,
    visibleColumns: { [key: string]: boolean },
    showEmail: boolean,
    sortConfig: { key: SortableKeys, direction: 'asc' | 'desc' } | null,
    requestSort: (key: SortableKeys) => void
}> = ({ data, onDelete, onEdit, visibleColumns, showEmail, sortConfig, requestSort }) => {
    
    const SortableHeader: React.FC<{ columnKey: SortableKeys, label: string }> = ({ columnKey, label }) => {
        const isSorted = sortConfig?.key === columnKey;
        return (
            <th scope="col" className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer" onClick={() => requestSort(columnKey)}>
                <div className="flex items-center gap-1">
                    {label}
                    {isSorted ? (sortConfig?.direction === 'asc' ? '▲' : '▼') : <ChevronsUpDown size={12} className="opacity-50" />}
                </div>
            </th>
        );
    };

    return (
        <Card className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <SortableHeader columnKey="name" label="Service" />
                  {visibleColumns.category && <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>}
                  {visibleColumns.cost && <SortableHeader columnKey="price" label="Cost" />}
                  {visibleColumns.billingPeriod && <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Billing Period</th>}
                  {visibleColumns.nextPaymentDate && <SortableHeader columnKey="nextPayment" label="Next Payment" />}
                  {visibleColumns.status && <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>}
                  {visibleColumns.paymentMethod && <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Payment Method</th>}
                  {visibleColumns.endDate && <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">End Date</th>}
                  {visibleColumns.website && <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Website</th>}
                   {visibleColumns.usage && <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Usage</th>}
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
                           {showEmail && sub.email && (
                                <p className="text-xs text-slate-400 truncate max-w-[200px]">{sub.email}</p>
                           )}
                        </div>
                      </div>
                    </td>
                    {visibleColumns.category && <td className="px-6 py-3.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(sub.category)}
                          <span className="truncate max-w-[100px]" title={sub.category}>{sub.category}</span>
                        </div>
                    </td>}
                    {visibleColumns.cost && <td className="px-6 py-3.5 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(sub.price)}
                    </td>}
                    {visibleColumns.billingPeriod && <td className="px-6 py-3.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {sub.billingPeriod}
                    </td>}
                    {visibleColumns.nextPaymentDate && <td className="px-6 py-3.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                         {sub.nextPayment !== '-' ? formatDateDisplay(sub.nextPayment) : '-'}
                    </td>}
                    {visibleColumns.status && <td className="px-6 py-3.5 whitespace-nowrap">
                         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${sub.status === 'Active' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/50' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700'}`}>
                           {sub.status}
                         </span>
                    </td>}
                    {visibleColumns.paymentMethod && <td className="px-6 py-3.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {sub.paymentMethod}
                    </td>}
                    {visibleColumns.endDate && <td className="px-6 py-3.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {sub.endDate ? formatDateDisplay(sub.endDate) : '-'}
                    </td>}
                    {visibleColumns.website && <td className="px-6 py-3.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {sub.website ? <a href={sub.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-500 hover:underline">Visit <ExternalLink size={12}/></a> : '-'}
                    </td>}
                    {visibleColumns.usage && <td className="px-6 py-3.5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {sub.usage || '-'}
                    </td>}
                    <td className="px-6 py-3.5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(sub)} className="p-1.5 rounded-md transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700">
                          <FilePenLine size={16} />
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
}

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
              <FilePenLine size={14} />
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
          <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"><ChevronLeft size={20} /></button>
          <button onClick={() => setCurrentDate(new Date())} className="text-sm font-medium px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600">Today</button>
          <button onClick={() => changeMonth(1)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px border dark:border-slate-700 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="py-2.5 text-center text-xs font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 text-slate-500">{d}</div>)}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="bg-white dark:bg-slate-800/50 min-h-[120px]"></div>)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const daySubs = getSubsForDay(day);
          const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
          return (
            <div key={day} className={`bg-white dark:bg-slate-800/50 min-h-[120px] p-2 flex flex-col ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''}`}>
              <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-slate-900 dark:bg-blue-600 text-white' : ''}`}>{day}</span>
              <div className="flex-1 overflow-y-auto space-y-1.5 mt-1.5">
                {daySubs.map(sub => (
                  <div key={sub.id} onClick={() => onEdit(sub)} className="flex items-center gap-2 p-1.5 rounded-lg border shadow-sm cursor-pointer bg-white dark:bg-slate-700 border-gray-100 dark:border-slate-600 hover:border-gray-300">
                    <img src={getLogoUrl(sub)} alt="" className="w-5 h-5 object-contain rounded-md" onError={(e) => (e.currentTarget.style.display='none')} />
                    <span className="text-xs truncate w-full font-semibold text-slate-800 dark:text-slate-200">{sub.name}</span>
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
    const { subscriptions, addSubscription, updateSubscription, deleteSubscription, bulkAddSubscriptions, loading } = useData();
    const [filters, setFilters] = useState({ status: 'All', expenseType: 'All', billingPeriod: 'All', paymentMethod: 'All', category: 'All' });
    const [viewMode, setViewMode] = useState('list');
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys, direction: 'asc' | 'desc' } | null>(null);
    const [visibleColumns, setVisibleColumns] = useState({
        category: true, cost: true, billingPeriod: true, paymentMethod: true,
        nextPaymentDate: true, status: true, website: true, endDate: true, usage: true,
    });
    const [showEmail, setShowEmail] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<Subscription | null>(null);
    const [subToDelete, setSubToDelete] = useState<Subscription | null>(null);

    const inactiveSubscriptions = useMemo(() => subscriptions.filter(s => s.status === 'Inactive' && s.expenseType === 'Recurring'), [subscriptions]);
    const activeSubscriptions = useMemo(() => subscriptions.filter(s => s.status === 'Active' && s.expenseType === 'Recurring'), [subscriptions]);
    
    const categoryOptions = useMemo(() => {
        const categories = new Set(subscriptions.map(s => s.category));
        return Array.from(categories).map(c => ({ value: c, label: c }));
    }, [subscriptions]);
    
    const paymentMethodOptions = useMemo(() => {
        const methods = new Set(subscriptions.map(s => s.paymentMethod));
        return Array.from(methods).map(m => ({ value: m, label: m }));
    }, [subscriptions]);

    const filteredSubscriptions = useMemo(() => {
        return subscriptions
            .filter(sub => {
                if (filters.status !== 'All' && sub.status !== filters.status) return false;
                if (filters.expenseType !== 'All' && sub.expenseType !== filters.expenseType) return false;
                if (filters.billingPeriod !== 'All' && sub.billingPeriod !== filters.billingPeriod) return false;
                if (filters.paymentMethod !== 'All' && sub.paymentMethod !== filters.paymentMethod) return false;
                if (filters.category !== 'All' && sub.category !== filters.category) return false;
                return true;
            });
    }, [subscriptions, filters]);
    
    const subscriptionsWithNextPayment = useMemo(() => {
        return filteredSubscriptions.map(sub => {
            if (sub.status !== 'Active' || sub.expenseType !== 'Recurring') {
                return { ...sub, nextPayment: '-' };
            }
            const today = new Date();
            const firstPayment = new Date(sub.firstPayment);
            let nextPayment = new Date(firstPayment);
            
            if (nextPayment > today) { 
                return { ...sub, nextPayment: nextPayment.toISOString() };
            }

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
        });
    }, [filteredSubscriptions]);
    
    const sortedSubscriptions = useMemo(() => {
        let sortableItems = [...subscriptionsWithNextPayment];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (valA === '-') return 1;
                if (valB === '-') return -1;
                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        } else {
             sortableItems.sort((a, b) => new Date(b.firstPayment).getTime() - new Date(a.firstPayment).getTime());
        }
        return sortableItems;
    }, [subscriptionsWithNextPayment, sortConfig]);

    const requestSort = (key: SortableKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const summaryCards = useMemo(() => {
        const monthlyTotal = activeSubscriptions.reduce((sum, sub) => sum + (sub.billingPeriod === 'Yearly' ? sub.price / 12 : sub.price), 0);
        const mostExpensive = activeSubscriptions.reduce((max, sub) => {
            const currentCost = sub.billingPeriod === 'Yearly' ? sub.price / 12 : sub.price;
            return currentCost > (max?.price ?? 0) ? { ...sub, price: currentCost } : max;
        }, { price: 0, name: '-' });
        const potentialSavings = inactiveSubscriptions.reduce((sum, sub) => sum + (sub.billingPeriod === 'Yearly' ? sub.price / 12 : sub.price), 0);

        return {
            activeItems: activeSubscriptions.length,
            avgMonthly: monthlyTotal,
            mostExpensive: mostExpensive,
            potentialSavings,
        };
    }, [activeSubscriptions, inactiveSubscriptions]);

    const spendingProjectionData = useMemo(() => {
        const data = [];
        const today = new Date();
        today.setDate(1);

        for (let i = -5; i <= 6; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
            const monthName = date.toLocaleString('en-US', { month: 'short' });
            let monthlyTotal = 0;
            subscriptions.forEach(sub => {
                if (sub.status !== 'Active' || sub.expenseType !== 'Recurring') return;
                const firstPayment = new Date(sub.firstPayment);
                const endDate = sub.endDate ? new Date(sub.endDate) : null;
                const isActiveInMonth = firstPayment <= date && (!endDate || endDate >= date);
                if (isActiveInMonth) {
                    monthlyTotal += sub.billingPeriod === 'Yearly' ? sub.price / 12 : sub.price;
                }
            });
            data.push({ 
                name: monthName, 
                past: i <= 0 ? monthlyTotal : undefined,
                forecast: i >= 0 ? monthlyTotal : undefined,
            });
        }
        return data;
    }, [subscriptions]);
    
    const categoryBreakdownData = useMemo(() => {
        const categoryMap = new Map<string, number>();
        activeSubscriptions.forEach(sub => {
            const monthlyCost = sub.billingPeriod === 'Yearly' ? sub.price / 12 : sub.price;
            categoryMap.set(sub.category, (categoryMap.get(sub.category) || 0) + monthlyCost);
        });
        return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
    }, [activeSubscriptions]);

    const upcomingPayments = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date
         return activeSubscriptions.map(sub => {
             const firstPayment = new Date(sub.firstPayment);
             let nextPayment = new Date(firstPayment); 
             if (sub.billingPeriod === 'Monthly') {
                 while (nextPayment < today) nextPayment.setMonth(nextPayment.getMonth() + 1);
             } else {
                 while (nextPayment < today) nextPayment.setFullYear(nextPayment.getFullYear() + 1);
             }
             const daysUntil = Math.ceil((nextPayment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
             return { ...sub, nextPayment: nextPayment.toISOString(), daysUntil };
         }).sort((a,b) => a.daysUntil - b.daysUntil).slice(0, 5);
    }, [activeSubscriptions]);
    
    const paymentMethods = useMemo(() => {
        const methodMap = new Map<string, { total: number, count: number }>();
        activeSubscriptions.forEach(sub => {
            const monthlyCost = sub.billingPeriod === 'Yearly' ? sub.price / 12 : sub.price;
            const current = methodMap.get(sub.paymentMethod) || { total: 0, count: 0 };
            methodMap.set(sub.paymentMethod, { total: current.total + monthlyCost, count: current.count + 1});
        });
        return Array.from(methodMap.entries()).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.total - a.total);
    }, [activeSubscriptions]);
    
    const handleAdd = () => { setEditingSub(null); setAddModalOpen(true); };
    const handleEdit = (sub: Subscription) => { setEditingSub(sub); setAddModalOpen(true); };
    const handleDelete = (id: number | string) => { const sub = subscriptions.find(s => s.id === id); if (sub) setSubToDelete(sub); };
    const confirmDelete = () => { if (subToDelete) { deleteSubscription(subToDelete.id); setSubToDelete(null); } };
    const handleImportClick = () => { fileInputRef.current?.click(); };
    
    const handleExportCSV = () => {
        const headers = ['id', 'name', 'category', 'price', 'expenseType', 'billingPeriod', 'billingDay', 'firstPayment', 'endDate', 'paymentMethod', 'website', 'status', 'logoUrl', 'email', 'signupMethod', 'signupIdentifier', 'usage'];
        const escapeCSV = (value: any) => {
          const str = String(value ?? '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) return `"${str.replace(/"/g, '""')}"`;
          return str;
        };
        const csvContent = [ headers.join(','), ...subscriptions.map(sub => headers.map(header => escapeCSV(sub[header as keyof Subscription])).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "subscriptions.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string; const lines = text.trim().split(/\r?\n/);
                const header = lines[0].split(',').map(h => h.trim()); const rows = lines.slice(1);
                const subsToImport: Omit<Subscription, 'id'>[] = rows.map(row => {
                    const values = row.split(','); const subObject: any = {};
                    header.forEach((key, index) => {
                        let value: any = values[index];
                        if (key === 'price' || key === 'billingDay') value = parseFloat(value) || 0;
                        subObject[key] = value;
                    }); return subObject;
                });
                if(window.confirm(`Found ${subsToImport.length} subscriptions to import. Do you want to proceed?`)){
                    await bulkAddSubscriptions(subsToImport); alert("Import successful!");
                }
            } catch (error) { alert('Failed to import CSV. Please check the file format.'); console.error(error);
            } finally { if(fileInputRef.current) fileInputRef.current.value = ""; }
        }; reader.readAsText(file);
    };

    if (loading) return <div className="text-center p-10">Loading subscriptions...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 <Card><h4 className="text-sm text-slate-500">Active Items</h4><p className="text-2xl font-bold">{summaryCards.activeItems}</p></Card>
                 <Card><h4 className="text-sm text-slate-500">Avg. Monthly Expenses</h4><p className="text-2xl font-bold">{formatCurrency(summaryCards.avgMonthly)}</p></Card>
                 <Card><div className="flex justify-between items-center"><h4 className="text-sm text-slate-500">Most Expensive</h4><TrendingUp className="text-red-500" size={18}/></div><p className="text-lg font-bold">{formatCurrency(summaryCards.mostExpensive.price)}</p><p className="text-xs text-slate-400 truncate">{summaryCards.mostExpensive.name}</p></Card>
                 <Card><div className="flex justify-between items-center"><h4 className="text-sm text-slate-500">Potential Savings</h4><PiggyBank className="text-green-500" size={18}/></div><p className="text-lg font-bold">{formatCurrency(summaryCards.potentialSavings)}</p><p className="text-xs text-slate-400">from inactive subs</p></Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                 <Card className="lg:col-span-3">
                    <h3 className="text-lg font-semibold mb-4">Spending Projection</h3>
                     <ResponsiveContainer width="100%" height={300}>
                         <LineChart data={spendingProjectionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                             <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                             <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(Number(value))}/>
                             <Tooltip content={<CustomTooltip />} />
                             <Legend formatter={(value) => value === 'past' ? 'Past & Current' : 'Forecast'} />
                             <Line type="monotone" dataKey="past" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Past & Current" />
                             <Line type="monotone" dataKey="forecast" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 6 }} name="Forecast" />
                         </LineChart>
                     </ResponsiveContainer>
                 </Card>
                 <Card className="lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><CircleAlert size={18} className="text-amber-500" /> Upcoming Payments</h3>
                    <div className="space-y-2">
                        {upcomingPayments.map((sub) => {
                            const urgencyColor = sub.daysUntil <= 2 ? 'border-red-500/50 bg-red-500/10' : sub.daysUntil <= 7 ? 'border-amber-500/50 bg-amber-500/10' : 'border-transparent';
                            return (
                                <div key={sub.id} className={`flex items-center justify-between p-2 rounded-lg border ${urgencyColor}`}>
                                  <div className="flex items-center overflow-hidden">
                                    <div className="h-8 w-8 rounded-lg p-1 flex-shrink-0 flex items-center justify-center overflow-hidden border shadow-sm bg-white dark:bg-slate-700 border-gray-100 dark:border-slate-600 mr-3">
                                        <img src={getLogoUrl(sub)} alt={sub.name} className="h-full w-full object-contain" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40?text='+sub.name[0])} />
                                    </div>
                                    <div className="truncate">
                                        <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{sub.name}</p>
                                        <p className={`text-xs font-semibold ${sub.daysUntil <= 2 ? 'text-red-500' : sub.daysUntil <= 7 ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'}`}>{formatDaysUntil(sub.daysUntil)}</p>
                                    </div>
                                  </div>
                                  <span className="font-semibold text-slate-900 dark:text-white text-sm pl-2">{formatCurrency(sub.price)}</span>
                                </div>
                            )
                        })}
                    </div>
                 </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
                    <div className="space-y-2">
                        {categoryBreakdownData.slice(0, 10).map((item) => (
                            <button key={item.name} onClick={() => setFilters(p => ({...p, category: item.name}))} className="w-full flex items-center justify-between text-sm p-2 rounded-lg transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left">
                                <div className="flex items-center gap-3 truncate">
                                    <div className="w-8 h-8 flex-shrink-0 bg-slate-100 dark:bg-slate-700/50 rounded-lg flex items-center justify-center">
                                        {getCategoryIcon(item.name)}
                                    </div>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                                </div>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 tracking-tight">{formatCurrency(item.value)}</span>
                            </button>
                        ))}
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                    <div className="space-y-3">
                         {paymentMethods.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-sm p-2 rounded-lg transition-colors group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <div className="flex items-center">
                                <div className="w-10 h-7 bg-slate-100 dark:bg-slate-700/50 rounded-md flex items-center justify-center mr-4">
                                  {getPaymentMethodIcon(item.name)}
                                </div>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white tracking-tight">{formatCurrencyWithTHB(item.total)}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">All Subscriptions</h2>
                     <div className="flex items-center gap-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
                        <button onClick={handleImportClick} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"><FileUp className="h-4 w-4" /></button>
                        <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"><FileDown className="h-4 w-4" /></button>
                        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300"><PlusSquare className="h-4 w-4" /> Add Subscription</button>
                    </div>
                </div>
                <div className="border-t dark:border-slate-700 my-4"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-slate-500">Filter:</span>
                        <FilterDropdown title="All Status" value={filters.status} onChange={(v) => setFilters(p => ({...p, status: v}))} options={[{value: 'All', label: 'All Status'}, {value: 'Active', label: 'Active'}, {value: 'Inactive', label: 'Inactive'}]} />
                        <FilterDropdown title="All Categories" value={filters.category} onChange={(v) => setFilters(p => ({...p, category: v}))} options={[{value: 'All', label: 'All Categories'}, ...categoryOptions]} />
                        <FilterDropdown title="All Types" value={filters.expenseType} onChange={(v) => setFilters(p => ({...p, expenseType: v}))} options={[{value: 'All', label: 'All Types'}, {value: 'Recurring', label: 'Recurring'}, {value: 'One-Time', label: 'One-Time'}]} />
                        <FilterDropdown title="All Periods" value={filters.billingPeriod} onChange={(v) => setFilters(p => ({...p, billingPeriod: v}))} options={[{value: 'All', label: 'All Periods'}, {value: 'Monthly', label: 'Monthly'}, {value: 'Yearly', label: 'Yearly'}]} />
                        <FilterDropdown title="All Payment Methods" value={filters.paymentMethod} onChange={(v) => setFilters(p => ({...p, paymentMethod: v}))} options={[{value: 'All', label: 'All Payment Methods'}, ...paymentMethodOptions]} />
                    </div>
                     <div className="flex items-center gap-2">
                        {viewMode === 'list' && (
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                                   <span>Show Email</span>
                                   <Switch checked={showEmail} onChange={() => setShowEmail(!showEmail)} />
                                </label>
                                <ColumnsDropdown columns={visibleColumns} setColumns={setVisibleColumns} />
                            </div>
                         )}
                        <div className="p-1 rounded-lg flex bg-slate-100 dark:bg-slate-800">
                            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md transition-all text-sm flex items-center gap-2 ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}><Rows3 size={16} /> List</button>
                            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-md transition-all text-sm flex items-center gap-2 ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}><AppWindow size={16} /> Grid</button>
                            <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 rounded-md transition-all text-sm flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}><CalendarDays size={16} /> Calendar</button>
                        </div>
                    </div>
                </div>
            </Card>

            {viewMode === 'list' && <ListView data={sortedSubscriptions} onDelete={handleDelete} onEdit={handleEdit} visibleColumns={visibleColumns} showEmail={showEmail} sortConfig={sortConfig} requestSort={requestSort} />}
            {viewMode === 'grid' && <GridView data={sortedSubscriptions} onDelete={handleDelete} onEdit={handleEdit} />}
            {viewMode === 'calendar' && <CalendarView data={sortedSubscriptions} onEdit={handleEdit} />}
            
            <SubscriptionFormModal 
                isOpen={isAddModalOpen} 
                onClose={() => setAddModalOpen(false)}
                onSave={async (subData) => {
                    if (editingSub) { await updateSubscription({ ...editingSub, ...subData }); } 
                    else { await addSubscription(subData); }
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
