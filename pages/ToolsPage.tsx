import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { Search, Globe, Plus, MoreVertical, Edit, Trash2, ChevronRight } from 'lucide-react';
import type { Tool, ToolGroup } from '../types';
import { Modal } from '../components/ui/Modal';

// --- HELPER COMPONENTS ---

const getFaviconUrl = (url: string) => {
    try {
        if (!url) return '';
        const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
        return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
    } catch (e) {
        return '';
    }
};

const ToolItem: React.FC<{
    tool: Tool;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ tool, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <a 
            href={tool.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex items-center gap-2 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        >
            <img src={getFaviconUrl(tool.url)} alt="" className="w-4 h-4 object-contain flex-shrink-0" onError={(e) => { (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden'); e.currentTarget.style.display = 'none'; }} />
            <Globe size={16} className="text-slate-500 hidden flex-shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white truncate">{tool.name}</span>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" onMouseLeave={() => setMenuOpen(false)}>
                <button onClick={(e) => {e.preventDefault(); e.stopPropagation(); setMenuOpen(p => !p);}} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"><MoreVertical size={14} className="text-slate-500" /></button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-slate-800 rounded-md shadow-lg border dark:border-slate-700 z-20">
                        <button onClick={(e) => {e.preventDefault(); onEdit();}} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700"><Edit size={14} /> Edit</button>
                        <button onClick={(e) => {e.preventDefault(); onDelete();}} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={14} /> Delete</button>
                    </div>
                )}
            </div>
        </a>
    );
};

// --- MODALS ---
const ToolModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (tool: Partial<Tool>) => void; tool: Partial<Tool> | null; groups: ToolGroup[] }> = ({ isOpen, onClose, onSave, tool, groups }) => {
    const [formState, setFormState] = useState<Partial<Tool>>({ name: '', url: '', groupId: groups[0]?.id });
    useEffect(() => { if (isOpen) setFormState(tool || { name: '', url: '', groupId: groups[0]?.id }); }, [isOpen, tool, groups]);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formState); onClose(); };
    return (<Modal isOpen={isOpen} onClose={onClose} title={tool?.id ? 'Edit Tool' : 'Add New Tool'}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Tool Name</label><input type="text" value={formState.name || ''} onChange={e => setFormState({...formState, name: e.target.value})} className="w-full px-3 py-2 border rounded-md" required /></div>
            <div><label className="block text-sm font-medium mb-1">URL</label><input type="url" value={formState.url || ''} onChange={e => setFormState({...formState, url: e.target.value})} className="w-full px-3 py-2 border rounded-md" required placeholder="https://example.com" /></div>
            <div><label className="block text-sm font-medium mb-1">Group</label><select value={formState.groupId || ''} onChange={e => setFormState({...formState, groupId: e.target.value})} className="w-full px-3 py-2 border rounded-md appearance-none" required>{groups.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}</select></div>
            <div className="flex justify-end gap-2 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md border">Cancel</button><button type="submit" className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white">Save</button></div>
        </form>
    </Modal>);
};

const GroupModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (group: Partial<ToolGroup>) => void; group: Partial<ToolGroup> | null; }> = ({ isOpen, onClose, onSave, group }) => {
    const [title, setTitle] = useState('');
    useEffect(() => { if(isOpen) setTitle(group?.title || ''); }, [isOpen, group]);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...group, title }); onClose(); };
    return (<Modal isOpen={isOpen} onClose={onClose} title={group?.id ? 'Edit Group' : 'Add New Group'}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Group Name</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" required autoFocus /></div>
            <div className="flex justify-end gap-2 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md border">Cancel</button><button type="submit" className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white">Save</button></div>
        </form>
    </Modal>);
};

// --- MAIN PAGE ---
export const ToolsPage: React.FC = () => {
    const { toolGroups, tools, addTool, updateTool, deleteTool, addToolGroup, updateToolGroup, deleteToolGroup } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGroup, setFilterGroup] = useState('all');
    const [isToolModalOpen, setToolModalOpen] = useState(false);
    const [editingTool, setEditingTool] = useState<Partial<Tool> | null>(null);
    const [isGroupModalOpen, setGroupModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Partial<ToolGroup> | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'tool' | 'group' } | null>(null);

    const filteredAndSortedData = useMemo(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        const filteredTools = tools.filter(tool => (filterGroup === 'all' || tool.groupId === filterGroup) && (tool.name.toLowerCase().includes(lowercasedTerm) || tool.url.toLowerCase().includes(lowercasedTerm)));
        const relevantGroupIds = new Set(filteredTools.map(t => t.groupId));
        const filteredGroups = toolGroups.filter(group => filterGroup === 'all' ? relevantGroupIds.has(group.id) : group.id === filterGroup).sort((a, b) => a.order - b.order);
        
        const toolsByGroup = filteredTools.reduce((acc, tool) => {
            if (!acc[tool.groupId]) acc[tool.groupId] = [];
            acc[tool.groupId].push(tool);
            return acc;
        }, {} as Record<string, Tool[]>);

        return { groups: filteredGroups, toolsByGroup };
    }, [searchTerm, filterGroup, toolGroups, tools]);

    const handleSaveTool = (toolData: Partial<Tool>) => { if (toolData.id) { updateTool(toolData as Tool); } else { addTool(toolData as Omit<Tool, 'id' | 'order'>); }};
    const handleSaveGroup = (groupData: Partial<ToolGroup>) => { if (groupData.id) { updateToolGroup(groupData as ToolGroup); } else { addToolGroup(groupData.title!); }};
    const handleDeleteGroup = (id: string) => { if(tools.some(t => t.groupId === id)) { alert("Cannot delete a group that contains tools."); return; } deleteToolGroup(id); };
    
    const { groups, toolsByGroup } = filteredAndSortedData;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Tools</h1>
            <Card className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search tools..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-48 pl-10 pr-4 py-2 border rounded-lg"/></div>
                    <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)} className="border rounded-lg px-3 py-2 appearance-none h-full"><option value="all">All Groups</option>{toolGroups.sort((a,b) => a.order - b.order).map(g => <option key={g.id} value={g.id}>{g.title}</option>)}</select>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => { setEditingGroup(null); setGroupModalOpen(true); }} className="px-3 py-2 text-sm font-medium rounded-lg border bg-slate-100 dark:bg-slate-700 flex items-center gap-2"><Plus size={16}/> New Group</button>
                    <button onClick={() => { setEditingTool(null); setToolModalOpen(true); }} className="px-3 py-2 text-sm font-medium rounded-lg border bg-slate-800 text-white flex items-center gap-2"><Plus size={16}/> New Tool</button>
                </div>
            </Card>

            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 space-y-4">
                {groups.map(group => {
                    const groupTools = toolsByGroup[group.id]?.sort((a, b) => a.order - b.order) || [];
                    if (groupTools.length === 0) return null;

                    return (
                        <details key={group.id} className="block bg-white dark:bg-slate-800 rounded-2xl border border-zinc-200 dark:border-slate-700 p-3 break-inside-avoid group/card" open={searchTerm.length > 0}>
                            <summary className="flex justify-between items-center list-none cursor-pointer">
                                <div className="flex items-center gap-2">
                                     <ChevronRight className="transform transition-transform group-open:rotate-90" size={16} />
                                     <h3 className="font-semibold text-slate-800 dark:text-slate-100">{group.title}</h3>
                                </div>
                                <div className="summary-actions opacity-0 group-hover/card:opacity-100 transition-opacity" onClick={e => e.preventDefault()}>
                                    <button onClick={() => { setEditingGroup(group); setGroupModalOpen(true); }} className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"><Edit size={14} /></button>
                                    <button onClick={() => setItemToDelete({id: group.id, type: 'group'})} className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"><Trash2 size={14} className="text-red-500"/></button>
                                </div>
                            </summary>
                            <div className="mt-2 pt-2 border-t dark:border-slate-700 space-y-1">
                                {groupTools.map(tool => (
                                    <ToolItem 
                                        key={tool.id} 
                                        tool={tool} 
                                        onEdit={() => { setEditingTool(tool); setToolModalOpen(true); }}
                                        onDelete={() => setItemToDelete({id: tool.id, type: 'tool'})} 
                                    />
                                ))}
                            </div>
                        </details>
                    );
                })}
            </div>
            
            {isToolModalOpen && <ToolModal isOpen={isToolModalOpen} onClose={() => setToolModalOpen(false)} onSave={handleSaveTool} tool={editingTool} groups={toolGroups} />}
            {isGroupModalOpen && <GroupModal isOpen={isGroupModalOpen} onClose={() => setGroupModalOpen(false)} onSave={handleSaveGroup} group={editingGroup} />}
            {itemToDelete && <Modal isOpen={true} onClose={() => setItemToDelete(null)} title={`Delete ${itemToDelete.type}`}>
                <p>Are you sure you want to delete this {itemToDelete.type}? This action cannot be undone.</p>
                <div className="flex justify-end gap-2 pt-4">
                    <button onClick={() => setItemToDelete(null)} className="px-4 py-2 text-sm rounded-md border">Cancel</button>
                    <button onClick={() => { if (itemToDelete.type === 'tool') deleteTool(itemToDelete.id); else handleDeleteGroup(itemToDelete.id); setItemToDelete(null); }} className="px-4 py-2 text-sm rounded-md bg-red-600 text-white">Delete</button>
                </div>
            </Modal>}
        </div>
    );
};
