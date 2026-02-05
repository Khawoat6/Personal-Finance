import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { AlertTriangle, UserPlus, Trash2, PlusCircle, Save, Sparkles, Edit } from 'lucide-react';
import type { LastWill, Contact, Account, DigitalAsset, SpecificGift } from '../types';
import { GoogleGenAI } from '@google/genai';
import { ProgressBar } from '../components/ui/ProgressBar';

const ContactSelectorModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    onSelect: (contactId: string) => void,
    contacts: Contact[],
    title: string,
}> = ({ isOpen, onClose, onSelect, contacts, title }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div className="space-y-2 max-h-80 overflow-y-auto">
            {contacts.map(contact => (
                <div key={contact.id} onClick={() => { onSelect(contact.id); onClose(); }} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                    <img src={contact.photoUrl || `https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=random`} alt="" className="w-8 h-8 rounded-full object-cover mr-3" />
                    <span>{contact.firstName} {contact.lastName}</span>
                </div>
            ))}
        </div>
    </Modal>
);

export const LastWillPage: React.FC = () => {
    const { lastWill, contacts, accounts, updateLastWill, loading } = useData();
    const [formState, setFormState] = useState<LastWill>({ assetBeneficiaries: {}, specificGifts: [], digitalAssets: [] });
    const [isSaved, setIsSaved] = useState(false);
    const [modal, setModal] = useState<{ type: 'executor' | 'guardian' | 'beneficiary' | 'gift' | 'digitalAsset', context?: any } | null>(null);
    const [isRefining, setIsRefining] = useState(false);

    useEffect(() => {
        if (lastWill) {
            setFormState(prev => ({
                ...prev,
                ...lastWill,
                digitalAssets: lastWill.digitalAssets || [],
            }));
        }
    }, [lastWill]);
    
    const completionStatus = useMemo(() => {
        const sections = {
            executor: !!formState.executorId,
            guardian: !!formState.guardianId,
            assetDistribution: Object.keys(formState.assetBeneficiaries).length > 0,
            specificGifts: formState.specificGifts.length > 0,
            digitalAssets: formState.digitalAssets.length > 0,
            finalWishes: (formState.finalWishes || '').length > 10,
        };
        const completedCount = Object.values(sections).filter(Boolean).length;
        const totalCount = Object.keys(sections).length;
        const percentage = (completedCount / totalCount) * 100;
        return { sections, percentage, completedCount, totalCount };
    }, [formState]);
    
    if (loading) return <div className="text-center p-10">Loading Your Will...</div>;

    const handleSave = async () => {
        await updateLastWill(formState);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const getContact = (id?: string) => contacts.find(c => c.id === id);

    const handleSelectContact = (type: 'executor' | 'guardian' | 'beneficiary' | 'gift', id: string) => {
        if (type === 'executor') setFormState(p => ({ ...p, executorId: id }));
        if (type === 'guardian') setFormState(p => ({ ...p, guardianId: id }));
        if (type === 'beneficiary' && modal?.context?.accountId) {
             const { accountId } = modal.context;
             const existing = formState.assetBeneficiaries[accountId] || [];
             setFormState(p => ({...p, assetBeneficiaries: {...p.assetBeneficiaries, [accountId]: [...existing, { contactId: id, percentage: 0 }]}}))
        }
        if (type === 'gift' && modal?.context?.giftId) {
            const { giftId } = modal.context;
            setFormState(p => ({...p, specificGifts: p.specificGifts.map(g => g.id === giftId ? {...g, contactId: id} : g)}));
        }
    };

    const handleAssetPercentageChange = (accountId: string, contactId: string, percentage: number) => {
        const beneficiaries = formState.assetBeneficiaries[accountId] || [];
        const updated = beneficiaries.map(b => b.contactId === contactId ? { ...b, percentage: isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage)) } : b);
        setFormState(p => ({...p, assetBeneficiaries: {...p.assetBeneficiaries, [accountId]: updated}}));
    };

    const removeBeneficiary = (accountId: string, contactId: string) => {
        const beneficiaries = formState.assetBeneficiaries[accountId] || [];
        const updated = beneficiaries.filter(b => b.contactId !== contactId);
        setFormState(p => ({...p, assetBeneficiaries: {...p.assetBeneficiaries, [accountId]: updated}}));
    };

    const addGift = () => {
        const newGift: SpecificGift = { id: `gift-${Date.now()}`, itemDescription: '', contactId: '' };
        setFormState(p => ({...p, specificGifts: [...p.specificGifts, newGift]}));
    };
    
    const updateGift = (id: string, description: string) => {
        setFormState(p => ({...p, specificGifts: p.specificGifts.map(g => g.id === id ? {...g, itemDescription: description} : g)}));
    };

    const removeGift = (id: string) => {
        setFormState(p => ({...p, specificGifts: p.specificGifts.filter(g => g.id !== id)}));
    };
    
    // --- Digital Asset Handlers ---
    const addOrUpdateDigitalAsset = (asset: Omit<DigitalAsset, 'id'>, id?: string) => {
        if (id) {
            setFormState(p => ({...p, digitalAssets: p.digitalAssets.map(a => a.id === id ? {...a, ...asset} : a)}));
        } else {
            const newAsset: DigitalAsset = { ...asset, id: `da-${Date.now()}`};
            setFormState(p => ({...p, digitalAssets: [...p.digitalAssets, newAsset]}));
        }
        setModal(null);
    };
    const removeDigitalAsset = (id: string) => {
        setFormState(p => ({...p, digitalAssets: p.digitalAssets.filter(a => a.id !== id)}));
    };
    
    const handleAiRefine = async () => {
        if (!formState.finalWishes || formState.finalWishes.trim().length < 10) {
            alert("Please write some final wishes before using the AI refiner.");
            return;
        }
        setIsRefining(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Rephrase the following final wishes into a more formal and clear tone for a last will document. Do not add any legal advice. Keep the original intent intact. Here is the text: "${formState.finalWishes}"`;
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });
            setFormState(p => ({ ...p, finalWishes: response.text ?? p.finalWishes }));
        } catch(e) {
            console.error(e);
            alert("Could not refine text. Please check your API key.");
        } finally {
            setIsRefining(false);
        }
    };

    const executor = getContact(formState.executorId);
    const guardian = getContact(formState.guardianId);
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
             {modal?.type === 'digitalAsset' && <DigitalAssetModal isOpen={true} onClose={() => setModal(null)} onSave={addOrUpdateDigitalAsset} asset={modal.context?.asset || null} />}
             {modal && ['executor', 'guardian', 'beneficiary', 'gift'].includes(modal.type) && <ContactSelectorModal 
                isOpen={true} 
                onClose={() => setModal(null)} 
                contacts={contacts} 
                title={`Select ${modal.type}`}
                onSelect={(id) => handleSelectContact(modal.type as any, id)}
            />}

            <div className="text-center">
                <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Last Will & Testament</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Document your final wishes for asset distribution and arrangements.</p>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Will Completion</h3>
                    <span className="text-sm font-medium">{completionStatus.completedCount} / {completionStatus.totalCount} Sections</span>
                </div>
                <ProgressBar value={completionStatus.percentage} max={100} colorClass="bg-sky-500" />
            </Card>
            
            <Card className="!bg-yellow-50 dark:!bg-yellow-900/40 border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-4">
                    <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Legal Disclaimer</h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            This tool is for planning purposes only and is **not** a legally binding document. To create a valid will, you must consult with a legal professional and follow the specific laws and execution requirements of your jurisdiction (e.g., signing with witnesses).
                        </p>
                    </div>
                </div>
            </Card>

            <div className="space-y-6">
                {['executor', 'guardian'].map(type => {
                    const person = type === 'executor' ? executor : guardian;
                    const title = type === 'executor' ? 'I. Executor of the Will' : 'II. Guardianship';
                    const description = type === 'executor' ? 'This person will be responsible for carrying out the terms of your will.' : 'Appoint a guardian for any minor dependents.';

                    return (
                         <Card key={type}>
                            <h2 className="text-lg font-bold mb-1">{title}</h2>
                            <p className="text-sm text-slate-500 mb-4">{description}</p>
                            {person ? (
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <img src={person.photoUrl || `https://ui-avatars.com/api/?name=${person.firstName}+${person.lastName}&background=random`} alt="" className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <p className="font-semibold">{person.firstName} {person.lastName}</p>
                                            <p className="text-xs text-slate-500">{person.relationship}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setModal({ type: type as 'executor' | 'guardian' })} className="px-3 py-1 text-sm border rounded-md hover:bg-slate-100">Change</button>
                                </div>
                            ) : (
                                <button onClick={() => setModal({ type: type as 'executor' | 'guardian' })} className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <UserPlus size={18} /> Select {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            )}
                        </Card>
                    );
                })}

                <Card>
                     <h2 className="text-lg font-bold mb-4">III. Distribution of Assets</h2>
                     <div className="space-y-4">
                        {accounts.map(acc => {
                            const beneficiaries = formState.assetBeneficiaries[acc.id] || [];
                            const totalPercent = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
                            return(
                                <div key={acc.id} className="p-3 border dark:border-slate-700 rounded-lg">
                                    <h3 className="font-semibold">{acc.name}</h3>
                                    <div className="space-y-2 mt-2">
                                        {beneficiaries.map(ben => {
                                            const contact = getContact(ben.contactId);
                                            return (
                                                <div key={ben.contactId} className="flex items-center gap-3">
                                                    <img src={contact?.photoUrl || `https://ui-avatars.com/api/?name=NN&background=random`} alt="" className="w-8 h-8 rounded-full object-cover"/>
                                                    <span className="flex-grow text-sm font-medium">{contact?.firstName} {contact?.lastName}</span>
                                                    <input type="number" value={ben.percentage} onChange={e => handleAssetPercentageChange(acc.id, ben.contactId, parseInt(e.target.value))} className="w-20 text-right px-2 py-1 border rounded-md" placeholder="%" />
                                                    <span className="text-sm">%</span>
                                                    <button onClick={() => removeBeneficiary(acc.id, ben.contactId)} className="p-1 text-red-500"><Trash2 size={16}/></button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button onClick={() => setModal({ type: 'beneficiary', context: { accountId: acc.id } })} className="mt-3 text-sm flex items-center gap-2 text-sky-600 dark:text-sky-400 font-semibold"><PlusCircle size={16}/> Add Beneficiary</button>
                                    <div className={`text-xs mt-2 font-semibold ${totalPercent === 100 ? 'text-green-600' : 'text-red-500'}`}>Total Allocated: {totalPercent}%</div>
                                </div>
                            )
                        })}
                     </div>
                </Card>

                 <Card>
                    <h2 className="text-lg font-bold mb-4">IV. Specific Gifts</h2>
                    <div className="space-y-3">
                        {formState.specificGifts.map(gift => {
                            const contact = getContact(gift.contactId);
                            return (
                                <div key={gift.id} className="flex items-center gap-3 p-2 border dark:border-slate-700 rounded-lg">
                                    <input type="text" value={gift.itemDescription} onChange={e => updateGift(gift.id, e.target.value)} placeholder="Item description (e.g. 'My Rolex watch')" className="flex-grow px-2 py-1 border-b"/>
                                    <span className="text-sm">to</span>
                                    <button onClick={() => setModal({ type: 'gift', context: { giftId: gift.id }})} className="min-w-[120px] text-left p-1 border-b">
                                        {contact ? `${contact.firstName} ${contact.lastName}` : 'Select...'}
                                    </button>
                                    <button onClick={() => removeGift(gift.id)} className="p-1 text-red-500"><Trash2 size={16}/></button>
                                </div>
                            );
                        })}
                        <button onClick={addGift} className="mt-3 text-sm flex items-center gap-2 text-sky-600 dark:text-sky-400 font-semibold"><PlusCircle size={16}/> Add Specific Gift</button>
                    </div>
                 </Card>

                 <Card>
                    <h2 className="text-lg font-bold mb-4">V. Digital Assets & Online Accounts</h2>
                    <div className="space-y-2">
                        {formState.digitalAssets.map(asset => (
                            <div key={asset.id} className="p-3 border dark:border-slate-700 rounded-lg flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{asset.accountName}</p>
                                    <p className="text-sm text-slate-500">{asset.identifier}</p>
                                    {asset.wishes && <p className="text-xs text-slate-400 mt-1">Wish: {asset.wishes}</p>}
                                </div>
                                <div className="flex-shrink-0">
                                    <button onClick={() => setModal({type: 'digitalAsset', context: { asset }})} className="p-1 text-slate-500"><Edit size={16}/></button>
                                    <button onClick={() => removeDigitalAsset(asset.id)} className="p-1 text-red-500"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                         <button onClick={() => setModal({type: 'digitalAsset'})} className="mt-3 w-full text-sm flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <PlusCircle size={16}/> Add Digital Asset
                        </button>
                    </div>
                 </Card>

                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">VI. Final Wishes & Arrangements</h2>
                        <button onClick={handleAiRefine} disabled={isRefining} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50">
                           <Sparkles size={14} className={isRefining ? 'animate-spin' : ''} /> {isRefining ? 'Refining...' : 'Refine with AI'}
                        </button>
                    </div>
                     <textarea value={formState.finalWishes || ''} onChange={e => setFormState(p => ({...p, finalWishes: e.target.value}))} rows={5} placeholder="Specify your preferences for funeral services, burial or cremation, and any personal messages." className="w-full p-2 border rounded-md"/>
                </Card>

            </div>

             <div className="pt-2 flex justify-end items-center gap-4">
                {isSaved && <p className="text-sm text-green-600 dark:text-green-400 animate-in fade-in">Will saved successfully!</p>}
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300">
                    <Save size={16} /> Save Will
                </button>
            </div>
        </div>
    );
};


const DigitalAssetModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (asset: Omit<DigitalAsset, 'id'>, id?: string) => void;
    asset: DigitalAsset | null;
}> = ({isOpen, onClose, onSave, asset}) => {
    const [form, setForm] = useState({ accountName: '', identifier: '', accessInstructions: '', wishes: '' });
    useEffect(() => {
        if (asset) setForm({ accountName: asset.accountName, identifier: asset.identifier, accessInstructions: asset.accessInstructions || '', wishes: asset.wishes || '' });
        else setForm({ accountName: '', identifier: '', accessInstructions: '', wishes: '' });
    }, [asset]);
    
    const handleSubmit = () => { onSave(form, asset?.id); };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={asset ? "Edit Digital Asset" : "Add Digital Asset"}>
            <div className="space-y-4">
                <div><label className="text-sm font-medium">Account Name</label><input type="text" value={form.accountName} onChange={e => setForm({...form, accountName: e.target.value})} placeholder="e.g., Facebook, Coinbase" className="w-full p-2 border rounded-md mt-1" /></div>
                <div><label className="text-sm font-medium">Username, Email, or ID</label><input type="text" value={form.identifier} onChange={e => setForm({...form, identifier: e.target.value})} placeholder="e.g., user@example.com" className="w-full p-2 border rounded-md mt-1" /></div>
                <div><label className="text-sm font-medium">Access Instructions (Optional)</label><textarea value={form.accessInstructions} onChange={e => setForm({...form, accessInstructions: e.target.value})} rows={3} placeholder="Do not include passwords. Describe location of credentials, 2FA methods, etc." className="w-full p-2 border rounded-md mt-1" /></div>
                <div><label className="text-sm font-medium">Your Wishes (Optional)</label><input type="text" value={form.wishes} onChange={e => setForm({...form, wishes: e.target.value})} placeholder="e.g., Memorialize account, transfer to..." className="w-full p-2 border rounded-md mt-1" /></div>
                <div className="flex justify-end gap-2 pt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white">Save</button>
                </div>
            </div>
        </Modal>
    );
};