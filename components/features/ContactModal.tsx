
import React, { useState, useEffect } from 'react';
import type { Contact, ClosenessTier } from '../../types';
import { useData } from '../../hooks/useData';
import { Modal } from '../ui/Modal';

const Input = "w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-colors";
const Select = `${Input} appearance-none`;
const Label = "block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300";

const initialFormState: Omit<Contact, 'id'> = {
    firstName: '', lastName: '', photoUrl: '', phone: '', email: '',
    address: '', birthday: '', relationship: 'Close Friend', connections: [],
    occupation: '', firstMet: '', socials: { linkedin: '', twitter: '', facebook: '', instagram: '' },
    group: '', spouseId: '', parents: [], closeness: 5, status: 'Active'
};

const tiers: { tier: ClosenessTier, label: string; description: string }[] = [
    { tier: 1, label: 'Tier 1 (BFFs)', description: 'Can handle both strong positive and strong negative experiences.' },
    { tier: 2, label: 'Tier 2 (Close)', description: 'Similar to BFFs, but not the first pick for intense situations.' },
    { tier: 3, label: 'Tier 3 (Fun)', description: 'Mostly pleasant, fun interactions, but not as deep.' },
    { tier: 4, label: 'Tier 4 (Neutral)', description: 'Neutral, frequent but surface-level interactions (e.g., neighbors).' },
    { tier: 5, label: 'Tier 5 (Acquaintance)', description: 'Neutral, sharing little, infrequent contact.' },
    { tier: 6, label: 'Tier 6 (Blacklist)', description: 'Consistently negative or draining interactions.' },
];

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    contact: Contact | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, contact }) => {
    const { addContact, updateContact, contacts } = useData();
    const [formState, setFormState] = useState<Omit<Contact, 'id'>>(initialFormState);

    useEffect(() => {
        if (isOpen) {
            const state = contact ? { ...initialFormState, ...contact } : initialFormState;
            state.socials = { ...initialFormState.socials, ...state.socials };
            if (!state.closeness) state.closeness = 5;
            if (!state.status) state.status = 'Active';
            setFormState(state);
        }
    }, [isOpen, contact]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, socials: { ...prev.socials, [name]: value } }));
    };

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name } = e.target;
        const selectedIds = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
        setFormState(prev => ({ ...prev, [name]: selectedIds }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalContact = {
            ...formState,
            birthday: formState.birthday ? new Date(formState.birthday).toISOString() : undefined,
            firstMet: formState.firstMet ? new Date(formState.firstMet).toISOString() : undefined,
        };
        if (contact) {
            await updateContact({ ...finalContact, id: contact.id });
        } else {
            await addContact(finalContact);
        }
        onClose();
    };

    const otherContacts = contacts.filter(c => c.id !== contact?.id);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={contact ? 'Edit Contact' : 'Add New Contact'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-4">
                    <img src={formState.photoUrl || 'https://via.placeholder.com/80'} alt="Profile" className="w-20 h-20 rounded-full object-cover bg-slate-200" />
                    <div className="flex-1">
                        <label htmlFor="photoUrl" className={Label}>Photo URL</label>
                        <input type="text" name="photoUrl" id="photoUrl" value={formState.photoUrl || ''} onChange={handleChange} className={Input} placeholder="https://..." />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className={Label}>First Name</label>
                        <input type="text" name="firstName" id="firstName" value={formState.firstName} onChange={handleChange} className={Input} required />
                    </div>
                    <div>
                        <label htmlFor="lastName" className={Label}>Last Name</label>
                        <input type="text" name="lastName" id="lastName" value={formState.lastName} onChange={handleChange} className={Input} required />
                    </div>
                </div>
                 <div>
                    <label htmlFor="occupation" className={Label}>Occupation</label>
                    <input type="text" name="occupation" id="occupation" value={formState.occupation || ''} onChange={handleChange} className={Input} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="email" className={Label}>Email</label>
                        <input type="email" name="email" id="email" value={formState.email || ''} onChange={handleChange} className={Input} />
                    </div>
                    <div>
                        <label htmlFor="phone" className={Label}>Phone</label>
                        <input type="tel" name="phone" id="phone" value={formState.phone || ''} onChange={handleChange} className={Input} />
                    </div>
                </div>

                <div className="border-t dark:border-slate-700 pt-4">
                    <label className={Label}>Closeness Tier</label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {tiers.map(({ tier, label }) => (
                            <div key={tier} className="relative group">
                                <button
                                    type="button"
                                    onClick={() => setFormState(prev => ({ ...prev, closeness: tier as ClosenessTier }))}
                                    className={`w-full p-2 text-sm text-center rounded-lg border transition-colors duration-200 ${
                                        formState.closeness === tier
                                            ? 'bg-sky-100 dark:bg-sky-900 border-sky-500 font-semibold'
                                            : 'bg-white dark:bg-slate-700/50 hover:border-slate-400 dark:hover:border-slate-500'
                                    }`}
                                >
                                    {label}
                                </button>
                                <div className="absolute bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    {tiers.find(t => t.tier === tier)?.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="status" className={Label}>Status</label>
                        <select name="status" id="status" value={formState.status} onChange={handleChange} className={Select}>
                            <option value="Active">Active</option>
                            <option value="Deceased">Deceased</option>
                            <option value="Lost Contact">Lost Contact</option>
                            <option value="Archived">Archived</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="group" className={Label}>Group / Cluster</label>
                        <input type="text" name="group" id="group" value={formState.group || ''} onChange={handleChange} className={Input} placeholder="e.g., University Squad" />
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="birthday" className={Label}>Birthday</label>
                        <input type="date" name="birthday" id="birthday" value={formState.birthday ? formState.birthday.split('T')[0] : ''} onChange={handleChange} className={Input} />
                    </div>
                     <div>
                        <label htmlFor="firstMet" className={Label}>First Met</label>
                        <input type="date" name="firstMet" id="firstMet" value={formState.firstMet ? formState.firstMet.split('T')[0] : ''} onChange={handleChange} className={Input} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="relationship" className={Label}>Relationship Type</label>
                        <select name="relationship" id="relationship" value={formState.relationship} onChange={handleChange} className={Select}>
                            <option>Close Friend</option><option>Family</option><option>Relative</option>
                            <option>University Friend</option><option>Colleague</option><option>Other</option>
                        </select>
                    </div>
                </div>

                <div className="border-t dark:border-slate-700 pt-4 space-y-4">
                     <h3 className="text-base font-semibold">Family Tree</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="spouseId" className={Label}>Spouse</label>
                           <select name="spouseId" id="spouseId" value={formState.spouseId || ''} onChange={handleChange} className={Select}>
                               <option value="">None</option>
                               {otherContacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                           </select>
                        </div>
                        <div>
                            <label htmlFor="parents" className={Label}>Parents</label>
                            <select name="parents" id="parents" multiple value={formState.parents || []} onChange={handleMultiSelectChange} className={`${Input} h-24`}>
                                {otherContacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                            </select>
                        </div>
                     </div>
                </div>
                
                <div className="border-t dark:border-slate-700 pt-4 space-y-2">
                    <label className="text-base font-semibold">Social Media</label>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="linkedin" placeholder="LinkedIn URL" value={formState.socials?.linkedin || ''} onChange={handleSocialsChange} className={Input} />
                        <input type="text" name="twitter" placeholder="Twitter URL" value={formState.socials?.twitter || ''} onChange={handleSocialsChange} className={Input} />
                        <input type="text" name="facebook" placeholder="Facebook URL" value={formState.socials?.facebook || ''} onChange={handleSocialsChange} className={Input} />
                        <input type="text" name="instagram" placeholder="Instagram URL" value={formState.socials?.instagram || ''} onChange={handleSocialsChange} className={Input} />
                    </div>
                </div>
                
                 <div className="border-t dark:border-slate-700 pt-4">
                    <label htmlFor="connections" className={Label}>General Connections</label>
                    <select name="connections" id="connections" multiple value={formState.connections || []} onChange={handleMultiSelectChange} className={`${Input} h-24`}>
                        {otherContacts.map(c => (
                            <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                        ))}
                    </select>
                </div>


                 <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-md hover:bg-slate-700 dark:hover:bg-slate-300">{contact ? 'Save Changes' : 'Add Contact'}</button>
                </div>
            </form>
        </Modal>
    );
};