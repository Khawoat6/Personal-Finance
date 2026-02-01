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
                        {yearsKnown && <p className="text-slate-500 dark:text-slate-400 pt-1">Known for {yearsKnown}</p>}
                    </div>
                     <div className="flex-grow"></div>
                    <div className="flex justify-center gap-3 my-2">
                        {contact.socials?.linkedin && <a href={contact.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Linkedin size={16}/></a>}
                        {contact.socials?.twitter && <a href={contact.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Twitter size={16}/></a>}
                        {contact.socials?.facebook && <a href={contact.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Facebook size={16}/></a>}
                        {contact.socials?.instagram && <a href={contact.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Instagram size={16}/></a>}
                    </div>
                    <div className="flex justify-end gap-1 border-t dark:border-slate-700 pt-2">
                        <button onClick={() => onEdit(contact)} className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"><Edit size={12} /></button>
                        <button onClick={() => onDelete(contact.id)} className="p-1.5 rounded-md text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={12} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ContactCardView: React.FC<{ contacts: Contact[]; onEdit: (contact: Contact) => void; onDelete: (id: string) => void; }> = ({ contacts, onEdit, onDelete }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {contacts.map(contact => (
            <ContactFlipCard key={contact.id} contact={contact} onEdit={onEdit} onDelete={onDelete} />
        ))}
    </div>
);

const GroupedCardView: React.FC<{ contacts: Contact[]; onEdit: (contact: Contact) => void; onDelete: (id: string) => void; }> = ({ contacts, onEdit, onDelete }) => {
    const tiers = [
        { tier: 1, label: 'Tier 1: Inner Circle (BFFs & Family)', description: 'The people you trust the most and can handle anything with.' },
        { tier: 2, label: 'Tier 2: Close Friends', description: 'Great friends you rely on, but maybe not the first call in a crisis.' },
        { tier: 3, label: 'Tier 3: Fun Friends', description: 'Mostly pleasant, fun interactions, but not as deep.' },
        { tier: 4, label: 'Tier 4: Neighbors & Colleagues', description: 'Neutral, frequent but surface-level interactions.' },
        { tier: 5, label: 'Tier 5: Acquaintances', description: 'Neutral, sharing little, infrequent contact.' },
        { tier: 6, label: 'Tier 6: Blacklist', description: 'Consistently negative or draining interactions.' },
    ];
    
    const groupedContacts = useMemo(() => {
        const groups = new Map<ClosenessTier, Contact[]>();
        const uncategorized: Contact[] = [];
        
        contacts.forEach(contact => {
            const tier = contact.closeness;
            if (tier) {
                if (!groups.has(tier)) groups.set(tier, []);
                groups.get(tier)!.push(contact);
            } else {
                uncategorized.push(contact);
            }
        });

        if (uncategorized.length > 0) {
            groups.set(5, [...(groups.get(5) || []), ...uncategorized]);
        }
        
        return groups;
    }, [contacts]);

    return (
        <div className="space-y-10">
            {tiers.map(({ tier, label, description }) => {
                const contactsInTier = groupedContacts.get(tier as ClosenessTier);
                if (!contactsInTier || contactsInTier.length === 0) return null;

                return (
                    <section key={tier}>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{label}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
                        </div>
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                            {contactsInTier.map(contact => (
                                <ContactFlipCard key={contact.id} contact={contact} onEdit={onEdit} onDelete={onDelete} />
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
};


const TableView: React.FC<{ contacts: Contact[]; onEdit: (contact: Contact) => void; onDelete: (id: string) => void; }> = ({ contacts, onEdit, onDelete }) => {
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' } | null>(null);

    const sortedContacts = useMemo(() => {
        let sortableItems = [...contacts];
        if (sortConfig) {
            sortableItems.sort((a, b) => {
                let aValue = '';
                let bValue = '';
                const key = sortConfig.key;
                
                switch (key) {
                    case 'name':
                        aValue = `${a.firstName} ${a.lastName}`;
                        bValue = `${b.firstName} ${b.lastName}`;
                        break;
                    case 'occupation':
                        aValue = a.occupation || '';
                        bValue = b.occupation || '';
                        break;
                    case 'relationship':
                        aValue = a.relationship;
                        bValue = b.relationship;
                        break;
                    case 'group':
                        aValue = a.group || '';
                        bValue = b.group || '';
                        break;
                }
                
                if (aValue.toLowerCase() < bValue.toLowerCase()) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue.toLowerCase() > bValue.toLowerCase()) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [contacts, sortConfig]);

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
                    {isSorted ? (sortConfig?.direction === 'asc' ? '▲' : '▼') : <ChevronsUpDown size={12} className="opacity-40" />}
                </div>
            </th>
        );
    };

    return (
        <Card className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                    <tr>
                        <SortableHeader columnKey="name" label="Name" />
                        <SortableHeader columnKey="occupation" label="Occupation" />
                        <SortableHeader columnKey="relationship" label="Relationship" />
                        <SortableHeader columnKey="group" label="Group" />
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedContacts.map(contact => (
                        <tr key={contact.id} onClick={() => onEdit(contact)} className="group bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50 cursor-pointer">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                                <img src={contact.photoUrl || `https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=random`} alt="" className="w-8 h-8 rounded-full object-cover" />
                                {contact.firstName} {contact.lastName}
                            </td>
                            <td className="px-6 py-4">{contact.occupation || '-'}</td>
                            <td className="px-6 py-4">{contact.relationship}</td>
                            <td className="px-6 py-4">{contact.group || '-'}</td>
                            <td className="px-6 py-4">{contact.email || '-'}</td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); onEdit(contact); }} className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"><Edit size={14} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); onDelete(contact.id); }} className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500"><Trash2 size={14} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};

const CalendarView: React.FC<{ contacts: Contact[]; onEdit: (contact: Contact) => void; }> = ({ contacts, onEdit }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();

    const birthdaysByDate = useMemo(() => {
        const map = new Map<string, Contact[]>();
        contacts.forEach(contact => {
            if (contact.birthday) {
                const date = new Date(contact.birthday);
                const key = `${date.getMonth()}-${date.getDate()}`;
                if (!map.has(key)) map.set(key, []);
                map.get(key)!.push(contact);
            }
        });
        return map;
    }, [contacts]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(1); // Avoid issues with different month lengths
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
        if (i < firstDay) return null;
        const day = i - firstDay + 1;
        const key = `${month}-${day}`;
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        return { day, birthdays: birthdaysByDate.get(key) || [], isToday };
    });

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronLeft size={18} /></button>
                    <button onClick={() => setCurrentDate(new Date())} className="text-sm px-3 py-1 rounded-lg border dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Today</button>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronRight size={18} /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 border dark:border-slate-700 rounded-lg overflow-hidden">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{day}</div>
                ))}
                {days.map((dayInfo, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 min-h-[140px] p-1.5">
                        {dayInfo && (
                            <>
                                <span className={`text-sm font-semibold ml-1 w-6 h-6 flex items-center justify-center rounded-full ${dayInfo.isToday ? 'bg-sky-500 text-white' : ''}`}>{dayInfo.day}</span>
                                <div className="mt-1 space-y-1">
                                    {dayInfo.birthdays.slice(0, 2).map(contact => (
                                        <div key={contact.id} onClick={() => onEdit(contact)} className="flex flex-col items-center gap-1 p-1 rounded-md bg-sky-50 dark:bg-sky-900/50 cursor-pointer hover:bg-sky-100 dark:hover:bg-sky-900">
                                            <img src={contact.photoUrl || `https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=random`} alt="" className="w-10 h-10 rounded-full" />
                                            <span className="text-xs font-medium text-center truncate w-full text-sky-800 dark:text-sky-200">{contact.firstName} {contact.lastName}</span>
                                        </div>
                                    ))}
                                    {dayInfo.birthdays.length > 2 && (
                                        <div className="p-1 rounded-md text-center text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800">
                                            + {dayInfo.birthdays.length - 2} more
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

const GraphView: React.FC<{ contacts: Contact[] }> = ({ contacts }) => {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 800, height: 700 });
    
    const initialPositions = useMemo(() => {
        const pos = new Map<string, { x: number, y: number }>();
        const groups = Array.from(new Set(contacts.map(c => c.group || c.relationship)));
        const groupCenters = new Map<string, { x: number, y: number }>();
        const angleStep = (2 * Math.PI) / (groups.length || 1);
        
        groups.forEach((group, i) => {
            const angle = i * angleStep;
            groupCenters.set(group, { x: 400 + 250 * Math.cos(angle), y: 350 + 250 * Math.sin(angle) });
        });

        const groupCounts = new Map<string, number>();
        contacts.forEach(node => {
            const group = node.group || node.relationship;
            const center = groupCenters.get(group) || { x: 400, y: 350 };
            const index = groupCounts.get(group) || 0;
            const radius = 60 + (index * 15 % 50);
            const angle = index * (Math.PI / 3);
            pos.set(node.id, { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) });
            groupCounts.set(group, index + 1);
        });
        return pos;
    }, [contacts]);

    const [positions, setPositions] = useState(initialPositions);
    const [draggedNode, setDraggedNode] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);

    useEffect(() => { setPositions(initialPositions); }, [initialPositions]);

    const { nodes, edges, connections } = useMemo(() => {
        const nodes = contacts.map(c => ({ 
            id: c.id, 
            label: `${c.firstName} ${c.lastName}`, 
            group: c.group || c.relationship, 
            photo: c.photoUrl || `https://ui-avatars.com/api/?name=${c.firstName}+${c.lastName}&background=random` 
        }));
        
        const edgeSet = new Set<string>();
        const connections = new Map<string, Set<string>>();
        
        contacts.forEach(c => {
            connections.set(c.id, new Set());
            (c.connections || []).forEach(connId => {
                edgeSet.add([c.id, connId].sort().join('-'));
                connections.get(c.id)!.add(connId);
                if (!connections.has(connId)) connections.set(connId, new Set());
                connections.get(connId)!.add(c.id);
            });
        });
        const edges = Array.from(edgeSet).map(edge => ({ source: edge.split('-')[0], target: edge.split('-')[1] }));

        return { nodes, edges, connections };
    }, [contacts]);

    const selectedConnections = useMemo(() => {
        if (!selectedNodeId) return null;
        return connections.get(selectedNodeId) || new Set();
    }, [selectedNodeId, connections]);
    
    const handleZoom = (factor: number) => {
        const { width, height } = viewBox;
        const newWidth = width * factor;
        const newHeight = height * factor;
        setViewBox(prev => ({
            x: prev.x - (newWidth - width) / 2,
            y: prev.y - (newHeight - height) / 2,
            width: newWidth,
            height: newHeight,
        }));
    };

    const handleReset = () => {
        setPositions(initialPositions);
        setViewBox({ x: 0, y: 0, width: 800, height: 700 });
    };

    const getSVGPoint = (e: React.MouseEvent) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const pt = svgRef.current.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const screenCTM = svgRef.current.getScreenCTM();
        return pt.matrixTransform(screenCTM?.inverse());
    };
    
    const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        const point = getSVGPoint(e);
        const pos = positions.get(nodeId);
        if (pos) {
            setDraggedNode({ id: nodeId, offsetX: point.x - pos.x, offsetY: point.y - pos.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggedNode) {
            setPositions(prev => {
                const newPositions = new Map(prev);
                const point = getSVGPoint(e);
                newPositions.set(draggedNode.id, { x: point.x - draggedNode.offsetX, y: point.y - draggedNode.offsetY });
                return newPositions;
            });
        }
    };
    
    const handleMouseUp = () => {
        setDraggedNode(null);
    };

    return (
        <Card className="h-[700px] p-0 overflow-hidden relative">
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 p-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg">
                <button onClick={() => handleZoom(0.8)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"><ZoomIn size={16}/></button>
                <button onClick={() => handleZoom(1.25)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"><ZoomOut size={16}/></button>
                <button onClick={handleReset} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"><RotateCcw size={16}/></button>
            </div>
            <svg ref={svgRef} width="100%" height="100%" viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onClick={() => setSelectedNodeId(null)}>
                <g className="edges">
                    {edges.map((edge, i) => {
                        const sourcePos = positions.get(edge.source);
                        const targetPos = positions.get(edge.target);
                        if (!sourcePos || !targetPos) return null;
                        
                        const isConnected = selectedNodeId && ( (edge.source === selectedNodeId && selectedConnections?.has(edge.target)) || (edge.target === selectedNodeId && selectedConnections?.has(edge.source)) );
                        
                        return <line key={i} x1={sourcePos.x} y1={sourcePos.y} x2={targetPos.x} y2={targetPos.y} 
                                   className={`transition-all stroke-2 ${selectedNodeId ? (isConnected ? 'stroke-blue-500 opacity-100' : 'stroke-slate-300 dark:stroke-slate-700 opacity-20') : 'stroke-slate-300 dark:stroke-slate-600'}`} />;
                    })}
                </g>
                <g className="nodes">
                    {nodes.map(node => {
                        const pos = positions.get(node.id); if (!pos) return null;
                        const isSelected = node.id === selectedNodeId;
                        const isConnected = selectedConnections?.has(node.id);
                        let opacity = 'opacity-100';
                        if (selectedNodeId && !isSelected && !isConnected) { opacity = 'opacity-20'; }
                        
                        return (
                            <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`} 
                               onMouseDown={(e) => handleMouseDown(e, node.id)}
                               onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                               className={`cursor-grab group transition-all ${opacity}`}>
                                <circle r={isSelected ? "30" : "22"} className={`stroke-2 transition-all ${isSelected ? 'fill-blue-100 dark:fill-blue-900 stroke-blue-500' : 'fill-white dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700'}`} />
                                <image href={node.photo} x={isSelected ? "-28" : "-20"} y={isSelected ? "-28" : "-20"} height={isSelected ? "56" : "40"} width={isSelected ? "56" : "40"} clipPath={`circle(${isSelected ? '28px' : '20px'})`} />
                                <text textAnchor="middle" y={isSelected ? 42 : 35} className="text-xs fill-slate-600 dark:fill-slate-300 font-semibold group-hover:fill-slate-900 dark:group-hover:fill-white select-none transition-all">{node.label.split(' ')[0]}</text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </Card>
    );
};

const FamilyTreeView: React.FC<{ contacts: Contact[]; onEdit: (c: Contact) => void }> = ({ contacts, onEdit }) => {
    
    type TreeNodeType = Contact & { children: string[] };
    const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

    const { familyTreeRoots, nodesMap } = useMemo(() => {
        const nodes = new Map<string, TreeNodeType>(contacts.map(c => [c.id, { ...c, children: [] }]));
        const hasParent = new Set<string>();

        contacts.forEach(contact => {
            if (contact.parents && contact.parents.length > 0) {
                contact.parents.forEach(parentId => {
                    const parent = nodes.get(parentId);
                    if (parent) {
                        parent.children.push(contact.id);
                        hasParent.add(contact.id);
                    }
                });
            }
        });
        
        let rootIds = contacts.map(c => c.id).filter(id => !hasParent.has(id));
        const processedRoots = new Set<string>();
        rootIds = rootIds.filter(id => {
            if (processedRoots.has(id)) return false;
            const node = nodes.get(id);
            // Fix: Added a `typeof` check to ensure spouseId is a string, resolving a TypeScript error where it was inferred as `unknown`.
            if (node && node.spouseId && typeof node.spouseId === 'string') {
                processedRoots.add(node.spouseId);
            }
            processedRoots.add(id);
            return true;
        });

        return { familyTreeRoots: rootIds, nodesMap: nodes };
    }, [contacts]);
    
    const toggleNode = (nodeId: string) => {
        setCollapsedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) { newSet.delete(nodeId); }
            else { newSet.add(nodeId); }
            return newSet;
        });
    };
    
    const TreeNode: React.FC<{ nodeId: string }> = ({ nodeId }) => {
        const node = nodesMap.get(nodeId);
        if (!node) return null;
        
        const spouse = node.spouseId ? nodesMap.get(node.spouseId) : null;
        const children = node.children.filter(childId => childId !== node.spouseId);
        const isCollapsed = collapsedNodes.has(nodeId);

        const NodeCard: React.FC<{contact: Contact; hasChildren: boolean; isCollapsed: boolean; onToggle: () => void}> = ({ contact, hasChildren, isCollapsed, onToggle }) => (
            <div className="relative">
                <div onClick={() => onEdit(contact)} className="p-2 rounded-lg bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-sm flex flex-col items-center gap-2 cursor-pointer hover:shadow-md hover:border-slate-400 w-32">
                    <img src={contact.photoUrl || `https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=random`} alt="" className="w-14 h-14 rounded-full" />
                    <span className="text-sm font-semibold text-center">{contact.firstName} {contact.lastName}</span>
                </div>
                {hasChildren && (
                    <button onClick={onToggle} className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-700 border dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 z-10">
                        {isCollapsed ? <Plus size={12} /> : <Minus size={12} />}
                    </button>
                )}
            </div>
        );

        return (
            <li className="flex flex-col items-center relative px-4 before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:h-6 before:bg-slate-300 dark:before:bg-slate-600 first:before:content-none">
                <div className="flex items-center gap-4 relative after:content-[''] after:absolute after:top-1/2 after:left-full after:w-4 after:h-px after:bg-slate-300 dark:after:bg-slate-600 last:after:content-none">
                    <NodeCard contact={node} hasChildren={children.length > 0} isCollapsed={isCollapsed} onToggle={() => toggleNode(nodeId)} />
                    {spouse && <NodeCard contact={spouse} hasChildren={false} isCollapsed={false} onToggle={() => {}} />}
                </div>

                {!isCollapsed && children.length > 0 && (
                     <ul className="flex justify-center pt-12 relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:h-6 before:bg-slate-300 dark:before:bg-slate-600 after:content-[''] after:absolute after:top-6 after:left-1/2 after:w-[calc(100%-8rem)] after:-translate-x-1/2 after:h-px after:bg-slate-300 dark:after:bg-slate-600">
                        {children.map(childId => <TreeNode key={childId} nodeId={childId} />)}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <Card className="p-4 md:p-8 overflow-x-auto min-w-full">
            {familyTreeRoots.length > 0 ? (
                <ul className="inline-flex">
                    {familyTreeRoots.map(rootId => <TreeNode key={rootId} nodeId={rootId} />)}
                </ul>
            ) : (
                <div className="text-center py-10">
                    <GitFork size={48} className="mx-auto text-slate-400" />
                    <h3 className="text-lg font-semibold mt-4">No Family Tree Data</h3>
                    <p className="text-slate-500 mt-1">Edit your contacts to add 'Spouse' or 'Parents' to build the tree.</p>
                </div>
            )}
        </Card>
    );
};


// --- Main Page Component ---

export const RelationshipsPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const { contacts, deleteContact, loading } = useData();
    const [viewMode, setViewMode] = useState<ViewMode>('card');
    const [cardViewType, setCardViewType] = useState<'grid' | 'grouped'>('grid');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [filterText, setFilterText] = useState('');

    const filteredContacts = useMemo(() => {
        return contacts.filter(contact =>
            `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(filterText.toLowerCase()) ||
            (contact.occupation || '').toLowerCase().includes(filterText.toLowerCase()) ||
            (contact.email || '').toLowerCase().includes(filterText.toLowerCase()) ||
            contact.relationship.toLowerCase().includes(filterText.toLowerCase()) ||
            (contact.group || '').toLowerCase().includes(filterText.toLowerCase())
        );
    }, [contacts, filterText]);


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

    const handleEdit = (contact: Contact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            deleteContact(id);
        }
    };
    
    const renderView = () => {
        switch (viewMode) {
            case 'card':
                return cardViewType === 'grouped'
                    ? <GroupedCardView contacts={filteredContacts} onEdit={handleEdit} onDelete={handleDelete} />
                    : <ContactCardView contacts={filteredContacts} onEdit={handleEdit} onDelete={handleDelete} />;
            case 'table':
                return <TableView contacts={filteredContacts} onEdit={handleEdit} onDelete={handleDelete} />;
            case 'calendar':
                return <CalendarView contacts={contacts} onEdit={handleEdit} />;
            case 'graph':
                return <GraphView contacts={contacts} />;
            case 'family-tree':
                return <FamilyTreeView contacts={contacts} onEdit={handleEdit} />;
            default:
                return <p>View not implemented yet.</p>;
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading relationships...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Relationships</h1>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, occupation, group..."
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
                        />
                    </div>
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                        <ViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />
                        {viewMode === 'card' && (
                            <>
                                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                <button
                                    onClick={() => setCardViewType('grid')}
                                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        cardViewType === 'grid' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500'
                                    }`}
                                >
                                    <Grid size={16} />
                                </button>
                                <button
                                    onClick={() => setCardViewType('grouped')}
                                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                        cardViewType === 'grouped' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500'
                                    }`}
                                >
                                    <Users2 size={16} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            {contacts.length > 0 ? renderView() : (
                 <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <Users size={48} className="mx-auto text-slate-400" />
                    <h3 className="text-lg font-semibold mt-4">No contacts yet</h3>
                    <p className="text-slate-500 mt-1">Click "Add Contact" to build your network.</p>
                </div>
            )}

            <ContactModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                contact={editingContact}
            />
        </div>
    );
};
