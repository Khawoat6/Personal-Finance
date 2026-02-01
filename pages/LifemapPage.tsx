
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import localforage from 'localforage';
import type { LifemapSettings, LifemapCategory, LifemapItem } from '../types';
import { Settings, Plus, Edit, Trash2, GripVertical, ArrowUp, ArrowDown, X, Check, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';

// --- CONFIG ---
const LIFEMAP_DB_KEY = 'lifemapData';
const YEAR_WIDTH_PX = 80;
const ITEM_HEIGHT_PX = 28;
const ITEM_V_MARGIN_PX = 4;
const CATEGORY_LABEL_WIDTH_PX = 180;

// --- DATA & STATE ---
const defaultSettings: LifemapSettings = {
  lifemapName: 'Oat Phattaraphon',
  dateOfBirth: '1996-12-23T00:00:00.000Z',
  ageRange: 80
};

const defaultCategories: LifemapCategory[] = [
  { id: 'cat-1', name: 'Projects', section: 'top', order: 0 },
  { id: 'cat-2', name: 'Relationships', section: 'top', order: 1 },
  { id: 'cat-3', name: 'Residences', section: 'top', order: 2 },
  { id: 'cat-4', name: 'Career', section: 'top', order: 3 },
  { id: 'cat-5', name: 'Inflection Points', section: 'bottom', order: 0 },
  { id: 'cat-6', name: 'Insights', section: 'bottom', order: 1 },
  { id: 'cat-7', name: 'Goals', section: 'bottom', order: 2 },
];

const defaultItems: LifemapItem[] = [
    { id: 'item-1', categoryId: 'cat-3', title: 'Alexandria, VA', startAge: 0, endAge: 3, color: 'blue', hideText: false },
    { id: 'item-2', categoryId: 'cat-4', title: 'Startup Person & Pedagogue', startAge: 35, endAge: 50, color: 'red', hideText: false },
    { id: 'item-3', categoryId: 'cat-2', title: 'Gena', startAge: 32, endAge: 65, color: 'red', hideText: false },
];

interface LifemapData {
    settings: LifemapSettings;
    categories: LifemapCategory[];
    items: LifemapItem[];
}

// --- MODALS ---
const Modal: React.FC<{isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, maxWidth?: string}> = ({isOpen, onClose, title, children, maxWidth="max-w-md"}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full ${maxWidth}`} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><X size={18} /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

const SettingsModal: React.FC<{ settings: LifemapSettings, onSave: (s: LifemapSettings) => void, onClose: () => void }> = ({ settings, onSave, onClose }) => {
    const [formState, setFormState] = useState(settings);

    const currentAge = useMemo(() => {
        if (!formState.dateOfBirth) return 0;
        const birthDate = new Date(formState.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }, [formState.dateOfBirth]);

    const handleSave = () => {
        onSave(formState);
        onClose();
    };
    
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Lifemap Name</label>
                <input type="text" value={formState.lifemapName} onChange={e => setFormState({...formState, lifemapName: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input type="date" value={formState.dateOfBirth.split('T')[0]} onChange={e => setFormState({...formState, dateOfBirth: new Date(e.target.value).toISOString()})} className="w-full px-3 py-2 border rounded-md" required/>
                <p className="text-xs text-slate-500 mt-1">Current age: {currentAge} years</p>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Age Range</label>
                <input type="number" value={formState.ageRange} onChange={e => setFormState({...formState, ageRange: parseInt(e.target.value, 10)})} className="w-full px-3 py-2 border rounded-md" />
                 <p className="text-xs text-slate-500 mt-1">Timeline shows ages 0 to {formState.ageRange}. Your current age ({currentAge}) will be marked.</p>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900">Save</button>
            </div>
        </div>
    );
};

const CategoriesModal: React.FC<{ categories: LifemapCategory[], onSave: (c: LifemapCategory[]) => void, onClose: () => void }> = ({ categories, onSave, onClose }) => {
    const [localCategories, setLocalCategories] = useState(categories);
    const [editingCat, setEditingCat] = useState<LifemapCategory | null>(null);

    const handleAddCategory = (section: 'top' | 'bottom') => {
        const maxOrder = Math.max(-1, ...localCategories.filter(c => c.section === section).map(c => c.order));
        const newCat: LifemapCategory = { id: `cat-${Date.now()}`, name: 'New Category', section, order: maxOrder + 1 };
        setLocalCategories([...localCategories, newCat]);
        setEditingCat(newCat);
    };

    const handleDelete = (id: string) => {
        setLocalCategories(localCategories.filter(c => c.id !== id));
    };
    
    const handleMove = (id: string, direction: 'up' | 'down') => {
        const cat = localCategories.find(c => c.id === id)!;
        const siblings = localCategories.filter(c => c.section === cat.section).sort((a,b) => a.order - b.order);
        const currentIndex = siblings.findIndex(c => c.id === id);
        
        let newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if(newIndex < 0 || newIndex >= siblings.length) return;
        
        const otherCat = siblings[newIndex];
        
        // Swap orders
        setLocalCategories(localCategories.map(c => {
            if(c.id === cat.id) return { ...c, order: otherCat.order };
            if(c.id === otherCat.id) return { ...c, order: cat.order };
            return c;
        }));
    };
    
    const renderCategoryList = (section: 'top' | 'bottom') => {
        const sectionCategories = localCategories.filter(c => c.section === section).sort((a,b) => a.order - b.order);
        
        return sectionCategories.map((cat, index) => (
             <div key={cat.id} className="flex items-center gap-2 p-2 rounded-lg border bg-white dark:bg-slate-700">
                <GripVertical size={16} className="text-slate-400 cursor-grab" />
                {editingCat?.id === cat.id ? (
                     <input type="text" value={editingCat.name} autoFocus onChange={e => setEditingCat({...editingCat, name: e.target.value})} className="flex-grow bg-transparent focus:outline-none"/>
                ) : (
                    <span className="flex-grow">{cat.name}</span>
                )}
                 {editingCat?.id === cat.id ? (
                    <button onClick={() => { setLocalCategories(localCategories.map(c => c.id === editingCat.id ? editingCat : c)); setEditingCat(null);}} className="p-1 text-green-500"><Check size={16} /></button>
                 ) : (
                    <button onClick={() => setEditingCat(cat)} className="p-1"><Edit size={16} /></button>
                 )}
                 <button onClick={() => handleMove(cat.id, section === 'top' ? 'down' : 'up')} disabled={section === 'top' ? index === sectionCategories.length-1 : index === 0} className="p-1 disabled:opacity-30"><ArrowDown size={16} /></button>
                 <button onClick={() => handleMove(cat.id, section === 'top' ? 'up' : 'down')} disabled={section === 'top' ? index === 0 : index === sectionCategories.length-1} className="p-1 disabled:opacity-30"><ArrowUp size={16} /></button>
                 <button onClick={() => handleDelete(cat.id)} className="p-1 text-red-500"><Trash2 size={16} /></button>
            </div>
        ));
    };

    return (
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold mb-2">Top Section</h4>
                <div className="space-y-2">{renderCategoryList('top')}</div>
                <button onClick={() => handleAddCategory('top')} className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-md border border-dashed hover:bg-slate-50 dark:hover:bg-slate-700">
                    <Plus size={16} /> Add Category
                </button>
            </div>
            <div className="border-t my-4 text-center text-xs text-slate-400 uppercase font-semibold relative">
                <span className="bg-white dark:bg-slate-800 px-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">AGE</span>
            </div>
             <div>
                <h4 className="font-semibold mb-2">Bottom Section</h4>
                <div className="space-y-2">{renderCategoryList('bottom')}</div>
                <button onClick={() => handleAddCategory('bottom')} className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-md border border-dashed hover:bg-slate-50 dark:hover:bg-slate-700">
                    <Plus size={16} /> Add Category
                </button>
            </div>
             <div className="flex justify-end gap-2 pt-4">
                <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border">Cancel</button>
                <button onClick={() => onSave(localCategories)} className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900">Save</button>
            </div>
        </div>
    );
};

const ItemModal: React.FC<{ item: Partial<LifemapItem> | null, categories: LifemapCategory[], onSave: (item: Omit<LifemapItem, 'id'>, id?: string) => void, onClose: () => void, ageRange: number }> = ({ item, categories, onSave, onClose, ageRange }) => {
    const [formState, setFormState] = useState<Omit<LifemapItem, 'id' | 'lane'>>({
        title: '', categoryId: categories[0]?.id || '', startAge: 0, endAge: 0, color: 'blue', hideText: false,
    });
    const [isEndMax, setIsEndMax] = useState(false);

    useEffect(() => {
        if(item) {
            setFormState({
                title: item.title || '',
                categoryId: item.categoryId || categories[0]?.id,
                startAge: item.startAge ?? 0,
                endAge: item.endAge ?? 0,
                color: item.color || 'blue',
                hideText: item.hideText || false,
            });
            setIsEndMax(item.endAge === null);
        }
    }, [item, categories]);

    const handleSave = () => {
        const finalItem = { ...formState, endAge: isEndMax ? null : formState.endAge };
        onSave(finalItem, item?.id);
        onClose();
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={formState.categoryId} onChange={e => setFormState({...formState, categoryId: e.target.value})} className="w-full px-3 py-2 border rounded-md" required>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Start Age</label>
                    <input type="number" step="0.1" value={formState.startAge} onChange={e => setFormState({...formState, startAge: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded-md" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">End Age</label>
                    <input type="number" step="0.1" value={formState.endAge || ''} onChange={e => setFormState({...formState, endAge: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded-md" disabled={isEndMax} />
                    <label className="flex items-center mt-2 text-sm"><input type="checkbox" checked={isEndMax} onChange={e => setIsEndMax(e.target.checked)} className="mr-2" /> Max</label>
                </div>
            </div>
             <div className="flex items-center justify-between">
                <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setFormState({...formState, color: 'blue'})} className={`w-8 h-8 rounded-full bg-blue-500 ${formState.color === 'blue' ? 'ring-2 ring-offset-2' : ''}`}></button>
                        <button type="button" onClick={() => setFormState({...formState, color: 'red'})} className={`w-8 h-8 rounded-full bg-red-500 ${formState.color === 'red' ? 'ring-2 ring-offset-2' : ''}`}></button>
                    </div>
                </div>
                <div>
                     <label className="flex items-center mt-2 text-sm"><input type="checkbox" checked={formState.hideText} onChange={e => setFormState({...formState, hideText: e.target.checked})} className="mr-2" /> Hide Text?</label>
                </div>
            </div>
             <div className="flex justify-end gap-2 pt-4">
                <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900">Create Item</button>
            </div>
        </div>
    );
};


// --- MAIN PAGE ---
export const LifemapPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const [data, setData] = useState<LifemapData | null>(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<'settings' | 'categories' | 'item' | null>(null);
    const [editingItem, setEditingItem] = useState<Partial<LifemapItem> | null>(null);

    // --- Data Management ---
    useEffect(() => {
        const loadData = async () => {
            let savedData = await localforage.getItem<LifemapData>(LIFEMAP_DB_KEY);
            if (!savedData) {
                savedData = { settings: defaultSettings, categories: defaultCategories, items: defaultItems };
            }
            setData(savedData);
            setLoading(false);
        };
        loadData();
    }, []);

    const saveData = useCallback(async (newData: LifemapData) => {
        setData(newData);
        await localforage.setItem(LIFEMAP_DB_KEY, newData);
    }, []);

    // --- Header Actions ---
    useEffect(() => {
        setHeaderActions(
            <div className="flex items-center gap-2">
                 <button onClick={() => {setEditingItem(null); setModal('item');}} className="px-3 py-2 text-sm rounded-md border flex items-center gap-2"><Plus size={16}/> Add Item</button>
                 <button onClick={() => setModal('categories')} className="px-3 py-2 text-sm rounded-md border flex items-center gap-2">Manage Categories</button>
                 <button onClick={() => setModal('settings')} className="p-2 rounded-md border"><Settings size={16}/></button>
            </div>
        );
         return () => setHeaderActions(null);
    }, [setHeaderActions]);

    // --- Handlers ---
    const handleSettingsSave = (newSettings: LifemapSettings) => saveData({ ...data!, settings: newSettings });
    const handleCategoriesSave = (newCategories: LifemapCategory[]) => saveData({ ...data!, categories: newCategories });
    const handleItemSave = (itemData: Omit<LifemapItem, 'id'>, id?: string) => {
        let newItems: LifemapItem[];
        if (id) { // Editing
            newItems = data!.items.map(i => i.id === id ? { ...i, ...itemData } : i);
        } else { // Adding
            newItems = [...data!.items, { ...itemData, id: `item-${Date.now()}` }];
        }
        saveData({ ...data!, items: newItems });
    };
    
    // --- Layout Calculation ---
    const layout = useMemo(() => {
        if (!data) return { top: new Map(), bottom: new Map(), topHeights: {}, bottomHeights: {} };

        const { categories, items, settings } = data;
        const topCategories = categories.filter(c => c.section === 'top').sort((a,b) => a.order - b.order);
        const bottomCategories = categories.filter(c => c.section === 'bottom').sort((a,b) => a.order - b.order);

        const calculateLayout = (categoryItems: LifemapItem[]) => {
            const lanes: LifemapItem[][] = [];
            const sortedItems = [...categoryItems].sort((a, b) => a.startAge - b.startAge);
            
            for (const item of sortedItems) {
                let placed = false;
                const itemEnd = item.endAge ?? settings.ageRange;
                for (let i = 0; i < lanes.length; i++) {
                    const lane = lanes[i];
                    const lastItemInLane = lane[lane.length-1];
                    const lastItemEnd = lastItemInLane.endAge ?? settings.ageRange;
                    if (item.startAge >= lastItemEnd) {
                        lane.push(item);
                        item.lane = i;
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    item.lane = lanes.length;
                    lanes.push([item]);
                }
            }
            return { itemsWithLanes: sortedItems, totalLanes: lanes.length };
        };
        
        const topLayout = new Map<string, LifemapItem[]>();
        const topHeights: {[key: string]: number} = {};
        topCategories.forEach(cat => {
            const catItems = items.filter(i => i.categoryId === cat.id);
            const { itemsWithLanes, totalLanes } = calculateLayout(catItems);
            topLayout.set(cat.id, itemsWithLanes);
            topHeights[cat.id] = totalLanes * (ITEM_HEIGHT_PX + ITEM_V_MARGIN_PX);
        });

        const bottomLayout = new Map<string, LifemapItem[]>();
        const bottomHeights: {[key: string]: number} = {};
        bottomCategories.forEach(cat => {
            const catItems = items.filter(i => i.categoryId === cat.id);
            const { itemsWithLanes, totalLanes } = calculateLayout(catItems);
            bottomLayout.set(cat.id, itemsWithLanes);
            bottomHeights[cat.id] = totalLanes * (ITEM_HEIGHT_PX + ITEM_V_MARGIN_PX);
        });

        return { top: topLayout, bottom: bottomLayout, topHeights, bottomHeights };
    }, [data]);
    
    // --- Render ---
    if (loading || !data) return <p>Loading Lifemap...</p>;
    
    if (!data.settings.dateOfBirth) {
         return (
            <div className="flex items-center justify-center h-full">
                <Card>
                    <h2 className="text-xl font-bold">Welcome to Lifemap</h2>
                    <p className="mt-2 text-slate-600">Please set up your lifemap to get started.</p>
                    <button onClick={() => setModal('settings')} className="mt-4 px-4 py-2 text-sm rounded-md bg-slate-800 text-white">Setup</button>
                </Card>
                {modal === 'settings' && <Modal isOpen={true} onClose={() => setModal(null)} title="Lifemap Settings"><SettingsModal settings={data.settings} onSave={handleSettingsSave} onClose={() => setModal(null)} /></Modal>}
            </div>
        );
    }
    
    const { settings, categories, items } = data;
    const topCategories = categories.filter(c => c.section === 'top').sort((a,b) => a.order - b.order);
    const bottomCategories = categories.filter(c => c.section === 'bottom').sort((a,b) => a.order - b.order);
    const totalWidth = settings.ageRange * YEAR_WIDTH_PX;
    const currentAge = new Date().getFullYear() - new Date(settings.dateOfBirth).getFullYear();
    
    return (
        <div className="w-full overflow-x-auto bg-slate-50 dark:bg-slate-900 p-4">
             {modal === 'settings' && <Modal isOpen={true} onClose={() => setModal(null)} title="Lifemap Settings"><SettingsModal settings={settings} onSave={handleSettingsSave} onClose={() => setModal(null)} /></Modal>}
             {modal === 'categories' && <Modal isOpen={true} onClose={() => setModal(null)} title="Manage Categories" maxWidth="max-w-xl"><CategoriesModal categories={categories} onSave={handleCategoriesSave} onClose={() => setModal(null)} /></Modal>}
             {modal === 'item' && <Modal isOpen={true} onClose={() => setModal(null)} title={editingItem?.id ? 'Edit Lifemap Item' : 'Add Lifemap Item'}><ItemModal item={editingItem} categories={categories} onSave={handleItemSave} onClose={() => setModal(null)} ageRange={settings.ageRange} /></Modal>}

            <div style={{ width: totalWidth + CATEGORY_LABEL_WIDTH_PX }} className="relative">
                {/* Top Section */}
                {topCategories.map(cat => (
                    <div key={cat.id} className="flex" style={{ height: Math.max(ITEM_HEIGHT_PX + ITEM_V_MARGIN_PX, layout.topHeights[cat.id] || 0)}}>
                        <div style={{width: CATEGORY_LABEL_WIDTH_PX}} className="sticky left-0 bg-slate-50 dark:bg-slate-900 z-10 flex items-center pr-4 font-semibold text-sm text-right justify-end text-slate-500">{cat.name}</div>
                        <div className="relative flex-grow border-b dark:border-slate-700">
                             {layout.top.get(cat.id)?.map(item => {
                                const left = item.startAge * YEAR_WIDTH_PX;
                                const width = ((item.endAge ?? settings.ageRange) - item.startAge) * YEAR_WIDTH_PX;
                                const top = (item.lane ?? 0) * (ITEM_HEIGHT_PX + ITEM_V_MARGIN_PX);
                                const colorClass = item.color === 'blue' ? 'bg-blue-500' : 'bg-red-500';
                                return (
                                    <div key={item.id} onClick={() => { setEditingItem(item); setModal('item'); }} style={{left, width, top, height: ITEM_HEIGHT_PX}} className={`absolute ${colorClass} rounded-md text-white px-2 text-xs flex items-center cursor-pointer overflow-hidden`}>
                                        {!item.hideText && <span className="whitespace-nowrap">{item.title}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Age Axis */}
                <div className="flex h-10 sticky top-0 bg-slate-50 dark:bg-slate-900 z-20">
                    <div style={{width: CATEGORY_LABEL_WIDTH_PX}} className="sticky left-0 bg-slate-50 dark:bg-slate-900 z-10"></div>
                    <div className="relative flex-grow bg-slate-800 dark:bg-slate-600 text-white rounded-md flex items-center">
                        {Array.from({ length: settings.ageRange + 1 }).map((_, age) => (
                            <div key={age} style={{left: age * YEAR_WIDTH_PX}} className="absolute h-full flex flex-col items-center">
                                {age % 5 === 0 && <span className="text-xs mt-1.5">{age}</span>}
                                <div className={`flex-grow w-px ${age % 10 === 0 ? 'bg-white/50' : 'bg-white/20'}`}></div>
                            </div>
                        ))}
                         <div style={{left: currentAge * YEAR_WIDTH_PX}} className="absolute h-full w-0.5 bg-green-400" title={`Current Age: ${currentAge}`}></div>
                    </div>
                </div>

                {/* Bottom Section */}
                {bottomCategories.map(cat => (
                     <div key={cat.id} className="flex" style={{ height: Math.max(ITEM_HEIGHT_PX + ITEM_V_MARGIN_PX, layout.bottomHeights[cat.id] || 0) }}>
                        <div style={{width: CATEGORY_LABEL_WIDTH_PX}} className="sticky left-0 bg-slate-50 dark:bg-slate-900 z-10 flex items-center pr-4 font-semibold text-sm text-right justify-end text-slate-500">{cat.name}</div>
                        <div className="relative flex-grow border-t dark:border-slate-700">
                             {layout.bottom.get(cat.id)?.map(item => {
                                const left = item.startAge * YEAR_WIDTH_PX;
                                const width = ((item.endAge ?? settings.ageRange) - item.startAge) * YEAR_WIDTH_PX;
                                const top = (item.lane ?? 0) * (ITEM_HEIGHT_PX + ITEM_V_MARGIN_PX) + ITEM_V_MARGIN_PX;
                                const colorClass = item.color === 'blue' ? 'bg-blue-500' : 'bg-red-500';
                                return (
                                    <div key={item.id} onClick={() => { setEditingItem(item); setModal('item'); }} style={{left, width, top, height: ITEM_HEIGHT_PX}} className={`absolute ${colorClass} rounded-md text-white px-2 text-xs flex items-center cursor-pointer overflow-hidden`}>
                                        {!item.hideText && <span className="whitespace-nowrap">{item.title}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
