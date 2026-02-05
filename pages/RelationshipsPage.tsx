import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useData } from '../hooks/useData';
import type { Contact, ClosenessTier } from '../types';
import { Card } from '../components/ui/Card';
import { ContactModal } from '../components/features/ContactModal';
import { formatDate } from '../utils/formatters';
import { PlusCircle, Edit, Trash2, LayoutGrid, List, Share2, Calendar, Users, ChevronLeft, ChevronRight, Linkedin, Twitter, Facebook, Instagram, Search, ChevronsUpDown, GitFork, Phone, Mail, ZoomIn, ZoomOut, RotateCcw, Plus, Minus, Users2, Grid } from 'lucide-react';

type ViewMode = 'card' | 'table' | 'graph' | 'calendar' | 'family-tree';
type SortableKeys = 'name' | 'occupation' | 'relationship' | 'group';

const calculateYearsKnown = (firstMet: string | undefined): string | null => {
    if (!firstMet) return null;
    const metDate = new Date(firstMet);
    const now = new Date();
    let years = now.getFullYear() - metDate.getFullYear();
    const m = now.getMonth() - metDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < metDate.getDate())) {
        years--;
    }
    if (years < 0) return null;
    if (years < 1) return "Less than a year";
    return `${years} year${years > 1 ? 's' : ''}`;
};

// --- View Components ---

const ViewSwitcher: React.FC<{ viewMode: ViewMode; setViewMode: (mode: ViewMode) => void }> = ({ viewMode, setViewMode }) => {
    const views: { id: ViewMode; icon: React.ElementType }[] = [
        { id: 'card', icon: LayoutGrid },
        { id: 'table', icon: List },
        { id: 'graph', icon: Share2 },
        { id: 'calendar', icon: Calendar },
        { id: 'family-tree', icon: GitFork },
    ];
    return (
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            {views.map(({ id, icon: Icon }) => (
                <button
                    key={id}
                    onClick={() => setViewMode(id)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        viewMode === id
                            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                    aria-label={`Switch to ${id} view`}
                >
                    <Icon size={16} />
                    <span className="capitalize hidden sm:inline">{id === 'family-tree' ? 'Family Tree' : id}</span>
                </button>
            ))}
        </div>
    );
};

const ContactFlipCard: React.FC<{ contact: Contact; onEdit: (contact: Contact) => void; onDelete: (id: string) => void; }> = ({ contact, onEdit, onDelete }) => {
    const yearsKnown = calculateYearsKnown(contact.firstMet);
    return (
        <div className="group aspect-[3/4] [perspective:1000px]">
            <div className="relative h-full w-full rounded-xl shadow-md transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front Side */}
                <div className="absolute inset-0 [backface-visibility:hidden]">
                    <img src={contact.photoUrl || `https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=random`} alt={`${contact.firstName} ${contact.lastName}`} className="absolute inset-0 h-full w-full object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl"></div>
                    <div className="absolute bottom-0 left-0 p-3 text-white w-full">
                        <h3 className="font-bold text-base truncate">{contact.firstName} {contact.lastName}</h3>
                        <p className="text-xs opacity-80 truncate">{contact.occupation}</p>
                        {contact.group && <span className="text-[10px] opacity-70 bg-white/20 px-2 py-0.5 rounded-full mt-1.5 inline-block">{contact.group}</span>}
                    </div>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 h-full w-full rounded-xl bg-white dark:bg-slate-800 p-3 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col text-sm">
                    <h3 className="font-bold truncate">{contact.firstName} {contact.lastName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{contact.relationship}</p>
                    <div className="border-t dark:border-slate-700 my-2"></div>
                    <div className="space-y-1 text-xs">
                        {contact.email && <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-sky-500 truncate"><Mail size={12} className="flex-shrink-0" /> <span className="truncate">{contact.email}</span></a>}
                        {contact.phone && <a href={`tel:${contact.phone}`} className="flex items-center gap-2 hover:text-sky-500 truncate"><Phone size={12} className="flex-shrink-0" /> <span className="truncate">{contact.phone}</span></a>}
                        {yearsKnown && <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><Users size={12} />Known for {yearsKnown}</p>}
                        <div className="flex items-center gap-3 pt-2">
                           {contact.socials?.linkedin && <a href={contact.socials.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={14} className="text-slate-400 hover:text-[#0077b5]" /></a>}
                           {contact.socials?.twitter && <a href={contact.socials.twitter} target="_blank" rel="noopener noreferrer"><Twitter size={14} className="text-slate-400 hover:text-[#1DA1F2]" /></a>}
                           {contact.socials?.facebook && <a href={contact.socials.facebook} target="_blank" rel="noopener noreferrer"><Facebook size={14} className="text-slate-400 hover:text-[#4267B2]" /></a>}
                           {contact.socials?.instagram && <a href={contact.socials.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={14} className="text-slate-400 hover:text-[#E1306C]" /></a>}
                        </div>
                    </div>
                    <div className="mt-auto flex justify-end gap-1">
                        <button onClick={() => onEdit(contact)} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"><Edit size={14} /></button>
                        <button onClick={() => onDelete(contact.id)} className="p-1.5 rounded-md text-slate-500 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
// FIX: Add missing RelationshipsPage component and export it.
export const RelationshipsPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const { contacts, deleteContact, loading } = useData();
    const [viewMode, setViewMode] = useState<ViewMode>('card');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' } | null>(null);

    useEffect(() => {
        setHeaderActions(
            <button
                onClick={() => { setEditingContact(null); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300"
            >
                <PlusCircle className="h-4 w-4" />
                <span>Add Contact</span>
            </button>
        );
        return () => setHeaderActions(null);
    }, [setHeaderActions]);

    const sortedContacts = useMemo(() => {
        let sortableItems = [...contacts];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let valA: string | undefined = '';
                let valB: string | undefined = '';
                if(sortConfig.key === 'name') {
                    valA = `${a.firstName} ${a.lastName}`;
                    valB = `${b.firstName} ${b.lastName}`;
                } else {
                    valA = a[sortConfig.key];
                    valB = b[sortConfig.key];
                }

                if (valA === undefined) return 1;
                if (valB === undefined) return -1;
                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [contacts, sortConfig]);

    const filteredContacts = useMemo(() => {
        return sortedContacts.filter(c => 
            `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.occupation && c.occupation.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (c.group && c.group.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [sortedContacts, searchTerm]);

    const handleEdit = (contact: Contact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            deleteContact(id);
        }
    };

    const requestSort = (key: SortableKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader: React.FC<{ columnKey: SortableKeys, label: string }> = ({ columnKey, label }) => {
        const isSorted = sortConfig?.key === columnKey;
        return (
            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(columnKey)}>
                <div className="flex items-center gap-1">
                    {label}
                    {isSorted ? (sortConfig?.direction === 'asc' ? '▲' : '▼') : <ChevronsUpDown size={12} className="opacity-50" />}
                </div>
            </th>
        );
    };

    if (loading) {
        return <div className="text-center p-10">Loading relationships...</div>;
    }

    const renderView = () => {
        switch (viewMode) {
            case 'card':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredContacts.map(contact => (
                            <ContactFlipCard key={contact.id} contact={contact} onEdit={handleEdit} onDelete={() => handleDelete(contact.id)} />
                        ))}
                    </div>
                );
            case 'table':
                return (
                    <Card className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3"></th>
                                    <SortableHeader columnKey="name" label="Name" />
                                    <SortableHeader columnKey="occupation" label="Occupation" />
                                    <SortableHeader columnKey="relationship" label="Relationship" />
                                    <SortableHeader columnKey="group" label="Group" />
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredContacts.map(c => (
                                    <tr key={c.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                        <td className="px-6 py-4">
                                            <img src={c.photoUrl || `https://ui-avatars.com/api/?name=${c.firstName}+${c.lastName}&background=random`} alt="" className="w-10 h-10 rounded-full object-cover" />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{c.firstName} {c.lastName}</td>
                                        <td className="px-6 py-4">{c.occupation}</td>
                                        <td className="px-6 py-4">{c.relationship}</td>
                                        <td className="px-6 py-4">{c.group}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button onClick={() => handleEdit(c)} className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"><Edit size={14} className="text-slate-500" /></button>
                                                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50"><Trash2 size={14} className="text-red-500" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                );
            case 'graph':
                 return <div className="text-center py-10 text-slate-500">Graph view coming soon!</div>
            case 'calendar':
                 return <div className="text-center py-10 text-slate-500">Calendar view coming soon!</div>
            case 'family-tree':
                 return <div className="text-center py-10 text-slate-500">Family Tree view coming soon!</div>
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Relationships</h1>
                <ViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />
            </div>
             <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search contacts by name, occupation, or group..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
            </div>
            {filteredContacts.length > 0 ? renderView() : 
                <Card className="text-center py-16 border-dashed border-2">
                    <Users2 className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-4 text-lg font-semibold">No contacts found</h3>
                    <p className="text-slate-500 mt-1">Try adjusting your search or add a new contact.</p>
                </Card>
            }
             <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                contact={editingContact}
            />
        </div>
    );
};
