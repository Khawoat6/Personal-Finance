
import React, { useState, useEffect } from 'react';
import type { Subscription } from '../../types';
import { SUBSCRIPTION_CATEGORIES } from '../../constants';
import { X } from 'lucide-react';

// --- Modal Component ---
const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X size={18} className="text-slate-500" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

// --- Form Component ---
const COMMON_SERVICES = ["Netflix", "Spotify", "YouTube Premium", "Amazon Prime", "Disney+", "iCloud", "Google One", "Microsoft 365", "Adobe Creative Cloud", "ChatGPT", "Gemini"];

export const SubscriptionFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (sub: Omit<Subscription, 'id'>) => void;
    subscription: Subscription | null;
}> = ({ isOpen, onClose, onSave, subscription }) => {
    const getTodayString = () => new Date().toISOString().split('T')[0];

    const initialFormState: Omit<Subscription, 'id'> = {
        name: '', category: 'Entertainment', price: 0, expenseType: 'Recurring',
        billingPeriod: 'Monthly', billingDay: 1, firstPayment: getTodayString(),
        endDate: '', paymentMethod: 'Credit Card', website: '', status: 'Active', logoUrl: ''
    };

    const [formState, setFormState] = useState(initialFormState);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setFormState(subscription ? { ...subscription, price: Number(subscription.price) } : initialFormState);
        }
    }, [isOpen, subscription]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'name') {
            if (value) {
                const filtered = COMMON_SERVICES.filter(s => s.toLowerCase().startsWith(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase());
                setSuggestions(filtered);
            } else {
                setSuggestions([]);
            }
        }
        
        setFormState(prev => ({ ...prev, [name]: name === 'price' || name === 'billingDay' ? Number(value) : value }));
    };
    
    const handleSuggestionClick = (name: string) => {
        setFormState(prev => ({ ...prev, name }));
        setSuggestions([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={subscription ? "Edit Subscription" : "Add New Subscription"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-400">Service Name</label>
                        <input required name="name" type="text" placeholder="e.g. Netflix" autoComplete="off"
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                            value={formState.name} onChange={handleChange} />
                        {suggestions.length > 0 && (
                             <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-md shadow-lg">
                                 {suggestions.map(s => (
                                     <div key={s} onClick={() => handleSuggestionClick(s)} className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">{s}</div>
                                 ))}
                             </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-400">Cost (THB)</label>
                        <input required name="price" type="number" placeholder="0"
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                            value={formState.price} onChange={handleChange} />
                    </div>
                </div>
                 <div>
                    <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-400">Logo URL (Optional)</label>
                    <input name="logoUrl" type="text" placeholder="https://..."
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                        value={formState.logoUrl} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-400">Category</label>
                    <select name="category" value={formState.category} onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                        {SUBSCRIPTION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-400">First Payment Date</label>
                        <input name="firstPayment" type="date" required
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                            value={formState.firstPayment} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1.5 text-slate-700 dark:text-slate-400">Status</label>
                        <select name="status" value={formState.status} onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </div>
                </div>
                <div className="pt-4 mt-4 border-t dark:border-slate-700 flex justify-end">
                    <button type="submit" className="px-5 py-2 text-sm font-bold text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300">
                        {subscription ? 'Save Changes' : 'Add Subscription'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
