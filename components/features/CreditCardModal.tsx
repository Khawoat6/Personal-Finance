import React, { useState, useEffect } from 'react';
import type { CreditCard } from '../../types';
import { useData } from '../../hooks/useData';
import { Modal } from '../ui/Modal';

const Input = "w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-colors";
const Select = `${Input} appearance-none`;
const Label = "block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300";

const initialFormState: Omit<CreditCard, 'id'> = {
    name: '', issuer: 'Other', last4: '', statementDate: 1, dueDate: 15,
    creditLimit: 0, currentBalance: 0, cardType: 'Visa', color: '#4b5563'
};

interface CreditCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: CreditCard | null;
}

export const CreditCardModal: React.FC<CreditCardModalProps> = ({ isOpen, onClose, card }) => {
    const { addCreditCard, updateCreditCard } = useData();
    const [formState, setFormState] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            setFormState(card ? card : initialFormState);
        }
    }, [isOpen, card]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['statementDate', 'dueDate', 'creditLimit', 'currentBalance'].includes(name);
        setFormState(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (card) {
            await updateCreditCard({ ...formState, id: card.id });
        } else {
            await addCreditCard(formState);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={card ? 'Edit Credit Card' : 'Add New Credit Card'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className={Label}>Card Name</label>
                        <input type="text" name="name" id="name" value={formState.name} onChange={handleChange} className={Input} placeholder="e.g., UOB Premier Miles" required />
                    </div>
                    <div>
                        <label htmlFor="last4" className={Label}>Last 4 Digits</label>
                        <input type="text" name="last4" id="last4" value={formState.last4} onChange={handleChange} className={Input} placeholder="1234" maxLength={4} required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="issuer" className={Label}>Issuer</label>
                        <select name="issuer" id="issuer" value={formState.issuer} onChange={handleChange} className={Select}>
                            <option>UOB</option><option>KTC</option><option>Citi</option><option>SCB</option>
                            <option>Kasikorn</option><option>Krungsri</option><option>Amex</option><option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="cardType" className={Label}>Card Type</label>
                        <select name="cardType" id="cardType" value={formState.cardType} onChange={handleChange} className={Select}>
                            <option>Visa</option><option>Mastercard</option><option>Amex</option><option>JCB</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="creditLimit" className={Label}>Credit Limit</label>
                        <input type="number" name="creditLimit" id="creditLimit" value={formState.creditLimit} onChange={handleChange} className={Input} placeholder="50000" required />
                    </div>
                    <div>
                        <label htmlFor="currentBalance" className={Label}>Current Balance</label>
                        <input type="number" name="currentBalance" id="currentBalance" value={formState.currentBalance} onChange={handleChange} className={Input} placeholder="0" required />
                    </div>
                </div>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="statementDate" className={Label}>Statement Day (1-31)</label>
                        <input type="number" name="statementDate" id="statementDate" value={formState.statementDate} onChange={handleChange} className={Input} min="1" max="31" required />
                    </div>
                    <div>
                        <label htmlFor="dueDate" className={Label}>Due Day (1-31)</label>
                        <input type="number" name="dueDate" id="dueDate" value={formState.dueDate} onChange={handleChange} className={Input} min="1" max="31" required />
                    </div>
                </div>
                <div>
                     <label htmlFor="color" className={Label}>Card Color</label>
                     <input type="color" name="color" id="color" value={formState.color} onChange={handleChange} className="w-full h-10 p-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer" />
                </div>
                 <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-md hover:bg-slate-700 dark:hover:bg-slate-300">{card ? 'Save Changes' : 'Add Card'}</button>
                </div>
            </form>
        </Modal>
    );
};