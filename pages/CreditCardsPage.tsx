import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import type { CreditCard } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ProgressBar } from '../components/ui/ProgressBar';
import { PlusCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { CreditCardModal } from '../components/features/CreditCardModal';

const issuerLogos: { [key: string]: string } = {
    UOB: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4XtnY259CF_Cn2zT_HwW9J6rqA9fV_2Enbw&s',
    KTC: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9d_y69HymC1lFYjbVoE_MvwrVd9zMSz-K-A&s',
    Citi: 'https://companieslogo.com/img/orig/c-c62f2b7f.png?t=1683348002',
    SCB: 'https://www.scb.co.th/content/dam/scb/about-us/brand-identity/scb-logo-2019-purple-en.png',
    Kasikorn: 'https://i.pinimg.com/originals/f3/7b/0a/f37b0a391512f459c043063f93ac0c80.png',
    Krungsri: 'https://www.krungsri.com/getmedia/e39bde41-6150-4220-8041-356a1b02b781/logo-krungsri-EN.png',
    Amex: 'https://s1.q4cdn.com/692158879/files/images/brand-style-guide/AXP_BlueBoxLogo_Alternate_STACKED_228x228.png',
};

const cardTypeLogos: { [key: string]: string } = {
    Visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
    Mastercard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1200px-MasterCard_Logo.svg.png',
    Amex: 'https://cdn.worldvectorlogo.com/logos/american-express-1.svg',
    JCB: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/JCB_logo.svg/1280px-JCB_logo.svg.png'
};

const CreditCardComponent: React.FC<{ 
    card: CreditCard;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ card, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const utilization = card.creditLimit > 0 ? (card.currentBalance / card.creditLimit) * 100 : 0;

    let utilColor = 'bg-sky-500';
    if (utilization > 70) utilColor = 'bg-red-500';
    else if (utilization > 30) utilColor = 'bg-yellow-500';

    return (
        <div 
            className="rounded-xl p-6 text-white shadow-lg relative flex flex-col justify-between aspect-[1.586]"
            style={{ background: `linear-gradient(45deg, ${card.color} 0%, #000000 100%)` }}
        >
            <div className="absolute top-4 right-4 z-10">
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 rounded-full hover:bg-white/20">
                    <MoreVertical size={18} />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-md shadow-lg border dark:border-slate-700">
                        <button onClick={() => { onEdit(); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <Edit size={14} /> Edit
                        </button>
                        <button onClick={() => { onDelete(); setMenuOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30">
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-start">
                <h3 className="font-semibold">{card.name}</h3>
                <img src={issuerLogos[card.issuer]} alt={card.issuer} className="h-8 object-contain" />
            </div>

            <div>
                <div className="text-2xl font-mono tracking-widest">
                    •••• •••• •••• {card.last4}
                </div>
                 <div className="flex justify-between items-end mt-4">
                    <span className="text-sm opacity-80">Balance</span>
                    <img src={cardTypeLogos[card.cardType]} alt={card.cardType} className="h-6 object-contain"/>
                </div>
                <div className="font-semibold text-2xl">{formatCurrency(card.currentBalance)}</div>
            </div>

            <div>
                <ProgressBar value={card.currentBalance} max={card.creditLimit} colorClass={utilColor} />
                <div className="flex justify-between items-center text-xs mt-1.5 opacity-80">
                    <span>Limit: {formatCurrency(card.creditLimit)}</span>
                    <span>Util: {utilization.toFixed(1)}%</span>
                </div>
                 <div className="flex justify-between items-center text-xs mt-2 opacity-80 pt-2 border-t border-white/20">
                    <span>Statement: Day {card.statementDate}</span>
                    <span>Due: Day {card.dueDate}</span>
                </div>
            </div>
        </div>
    );
};

export const CreditCardsPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const { creditCards, deleteCreditCard, loading } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<CreditCard | null>(null);

    useEffect(() => {
        setHeaderActions(
            <button
                onClick={() => { setEditingCard(null); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300"
            >
                <PlusCircle className="h-4 w-4" />
                <span>Add Card</span>
            </button>
        );
        return () => setHeaderActions(null);
    }, [setHeaderActions]);

    const handleEdit = (card: CreditCard) => {
        setEditingCard(card);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this credit card?')) {
            deleteCreditCard(id);
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading your cards...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Credit Cards</h1>

            {creditCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {creditCards.map(card => (
                        <CreditCardComponent
                            key={card.id}
                            card={card}
                            onEdit={() => handleEdit(card)}
                            onDelete={() => handleDelete(card.id)}
                        />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-semibold">No credit cards added yet</h3>
                    <p className="text-slate-500 mt-1">Click "Add Card" to get started.</p>
                </div>
            )}
            
            <CreditCardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                card={editingCard}
            />
        </div>
    );
};