
import React, { useState, useEffect } from 'react';
import type { Subscription } from '../../types';
import { SUBSCRIPTION_CATEGORIES } from '../../constants';
import { X, ChevronDown, Calendar, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// --- UI Components ---
const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center px-6 py-4 border-b dark:border-slate-800">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X size={18} className="text-slate-500" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

const SelectWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`relative ${className}`}>
        {children}
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
);

const DateInputWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`relative ${className}`}>
        {children}
        <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
);

const Input = "w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-colors";
const Select = `${Input} appearance-none pr-8`;
const Label = "block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300";

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
        endDate: '', paymentMethod: 'Credit Card', website: '', status: 'Active', logoUrl: '',
        email: '', signupMethod: 'Not Specified', signupIdentifier: '', usage: undefined
    };

    const [formState, setFormState] = useState(initialFormState);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const baseState = { ...initialFormState, firstPayment: getTodayString() };
            const editState = subscription 
                ? { ...baseState, ...subscription, price: Number(subscription.price) } 
                : baseState;
            setFormState(editState);
            setAiSuggestion(null);
            setIsSuggesting(false);
        }
    }, [isOpen, subscription]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'name') {
            if (value) {
                const filtered = COMMON_SERVICES.filter(s => s.toLowerCase().startsWith(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase());
                setSuggestions(filtered);
            } else { setSuggestions([]); }
        }
        
        setFormState(prev => ({ ...prev, [name]: name === 'price' || name === 'billingDay' ? Number(value) : value }));
    };
    
    const handleSuggestionClick = (name: string) => {
        setFormState(prev => ({ ...prev, name }));
        setSuggestions([]);
    };
    
    const handleNameBlur = async () => {
        if (formState.name.length < 3) return;
        setIsSuggesting(true);
        setAiSuggestion(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Based on the subscription name "${formState.name}", what is the most likely category from this list: ${SUBSCRIPTION_CATEGORIES.join(', ')}? Respond with only the category name from the list provided.`;
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });
            const suggestedCategory = response.text?.trim();

            if (suggestedCategory && SUBSCRIPTION_CATEGORIES.includes(suggestedCategory)) {
                setAiSuggestion(suggestedCategory);
            }
        } catch (error) {
            console.error("AI suggestion failed:", error);
        } finally {
            setIsSuggesting(false);
        }
    };

    const applyAiSuggestion = () => {
        if (aiSuggestion) {
            setFormState(prev => ({ ...prev, category: aiSuggestion }));
            setAiSuggestion(null);
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState);
    };

    const showIdentifierInput = formState.signupMethod === 'Google' || formState.signupMethod === 'Apple ID';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={subscription ? "Edit Subscription" : "Add New Subscription"}>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <label className={Label}>Service Name</label>
                        <input required name="name" type="text" placeholder="e.g. Netflix" autoComplete="off" className={Input} value={formState.name} onChange={handleChange} onBlur={handleNameBlur} />
                        {suggestions.length > 0 && (
                             <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-md shadow-lg">
                                 {suggestions.map(s => <div key={s} onClick={() => handleSuggestionClick(s)} className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">{s}</div>)}
                             </div>
                        )}
                    </div>
                    <div>
                        <label className={Label}>Cost (THB)</label>
                        <input required name="price" type="number" step="0.01" placeholder="0.00" className={Input} value={formState.price === 0 ? '' : formState.price} onChange={handleChange} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={Label}>Category</label>
                        <SelectWrapper><select name="category" value={formState.category} onChange={handleChange} className={Select}>{SUBSCRIPTION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></SelectWrapper>
                        {isSuggesting && <p className="text-xs text-slate-400 mt-1.5 animate-pulse">AI is thinking...</p>}
                        {aiSuggestion && (
                            <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-purple-500" />
                                    <p className="text-xs text-purple-700 dark:text-purple-300">AI Suggestion: <span className="font-semibold">{aiSuggestion}</span></p>
                                </div>
                                <button type="button" onClick={applyAiSuggestion} className="px-2 py-0.5 text-xs font-semibold bg-purple-200 text-purple-800 dark:bg-purple-400/50 dark:text-white rounded-md hover:bg-purple-300">Use</button>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className={Label}>Payment Method</label>
                        <SelectWrapper><select name="paymentMethod" value={formState.paymentMethod} onChange={handleChange} className={Select}><option>Credit Card</option><option>Debit Card</option><option>PayPal</option><option>Bank Transfer</option><option>Apple Pay</option><option>Google Pay</option></select></SelectWrapper>
                    </div>
                </div>

                <div className="border-t dark:border-slate-700 my-2"></div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={Label}>Expense Type</label>
                        <SelectWrapper><select name="expenseType" value={formState.expenseType} onChange={handleChange} className={Select}><option value="Recurring">Recurring</option><option value="One-Time">One-Time</option></select></SelectWrapper>
                    </div>
                     <div>
                        <label className={Label}>Billing Cycle</label>
                        <SelectWrapper><select name="billingPeriod" value={formState.billingPeriod} onChange={handleChange} className={Select}><option value="Monthly">Monthly</option><option value="Yearly">Yearly</option></select></SelectWrapper>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={Label}>First Payment Date</label>
                        <DateInputWrapper><input name="firstPayment" type="date" required className={`${Select} date-input`} value={formState.firstPayment} onChange={handleChange} /></DateInputWrapper>
                    </div>
                    <div>
                        <label className={Label}>End Date (Optional)</label>
                        <DateInputWrapper><input name="endDate" type="date" className={`${Select} date-input`} value={formState.endDate} onChange={handleChange} /></DateInputWrapper>
                    </div>
                </div>
                
                <div className="border-t dark:border-slate-700 my-2"></div>
                
                 <div>
                    <label className={Label}>Email (Optional)</label>
                    <input name="email" type="email" placeholder="user@example.com" className={Input} value={formState.email} onChange={handleChange} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={Label}>Sign-up Method (Optional)</label>
                        <SelectWrapper>
                           <select name="signupMethod" value={formState.signupMethod} onChange={handleChange} className={Select}>
                               <option>Not Specified</option>
                               <option>Google</option>
                               <option>Apple ID</option>
                               <option>Email/Password</option>
                           </select>
                        </SelectWrapper>
                    </div>
                    {showIdentifierInput && (
                        <div>
                           <label className={Label}>Account Used (Optional)</label>
                           <input name="signupIdentifier" type="text" placeholder={formState.signupMethod === 'Google' ? "user@gmail.com" : "user@icloud.com"} className={Input} value={formState.signupIdentifier} onChange={handleChange} />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className={Label}>Usage Level (Optional)</label>
                        <SelectWrapper>
                            <select name="usage" value={formState.usage || ''} onChange={handleChange} className={Select}>
                                <option value="">Not Specified</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                                <option value="Unused">Unused</option>
                            </select>
                        </SelectWrapper>
                    </div>
                    <div>
                        <label className={Label}>Website</label>
                        <input name="website" type="text" placeholder="https://..." className={Input} value={formState.website} onChange={handleChange} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   
                    <div>
                        <label className={Label}>Status</label>
                        <SelectWrapper><select name="status" value={formState.status} onChange={handleChange} className={Select}><option>Active</option><option>Inactive</option></select></SelectWrapper>
                    </div>
                </div>

                <div className="pt-4 mt-2 flex justify-end">
                    <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all">
                        {subscription ? 'Save Changes' : 'Add Subscription'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};