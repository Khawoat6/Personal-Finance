import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { PlusCircle, Image as ImageIcon, Edit, Trash2, UploadCloud, Link, GripVertical, FileDown, Loader2, CheckCircle, Undo } from 'lucide-react';
import type { VisionBoardItem, VisionBoardCategory } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const colorClasses: { [key: string]: { bg: string, text: string, border: string } } = {
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-800 dark:text-green-300', border: 'border-green-200 dark:border-green-800' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-800 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-800 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-800 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-800 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800' },
};


const VisionBoardCard: React.FC<{
    item: VisionBoardItem;
    category?: VisionBoardCategory;
    isDragging: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onToggleAchieved: () => void;
    onDragStart: (id: string) => void;
    onDragEnd: () => void;
    onDrop: (item: VisionBoardItem) => void;
}> = ({ item, category, isDragging, onEdit, onDelete, onToggleAchieved, onDragStart, onDragEnd, onDrop }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    return (
        <div
            draggable="true"
            onDragStart={() => onDragStart(item.id)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => { e.preventDefault(); onDrop(item); setIsDragOver(false); }}
            className={`group relative break-inside-avoid overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300
                        ${isDragging ? 'opacity-30' : 'opacity-100'}
                        ${isDragOver ? 'ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900' : ''}
                        ${item.achieved ? 'grayscale opacity-80' : ''}`}
        >
            <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover" />
             
            {item.achieved && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <CheckCircle size={48} className="text-white/80" />
                </div>
            )}

            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${item.achieved ? 'bg-gradient-to-t from-black/80 via-black/50 to-transparent' : ''}`}>
                <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                    {category && <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-1 inline-block ${colorClasses[category.color]?.bg.replace('dark:bg-','bg-opacity-80 dark:bg-opacity-80 dark:bg-')} ${colorClasses[category.color]?.text}`}>{category.name}</span>}
                    <h3 className="font-bold text-base truncate">{item.title}</h3>
                    {item.notes && <p className="text-xs opacity-80 truncate">{item.notes}</p>}
                </div>
                 <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="cursor-grab p-2 rounded-full bg-black/40 hover:bg-black/60" title="Drag to reorder">
                        <GripVertical size={16} />
                    </div>
                     <button onClick={onToggleAchieved} className="p-2 rounded-full bg-black/40 hover:bg-black/60" title={item.achieved ? 'Mark as Not Achieved' : 'Mark as Achieved'}>
                        {item.achieved ? <Undo size={16} /> : <CheckCircle size={16} />}
                    </button>
                    <button onClick={onEdit} className="p-2 rounded-full bg-black/40 hover:bg-black/60"><Edit size={16} /></button>
                    <button onClick={onDelete} className="p-2 rounded-full bg-black/40 hover:bg-black/60"><Trash2 size={16} /></button>
                </div>
            </div>
        </div>
    );
};

const VisionBoardItemModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Omit<VisionBoardItem, 'id' | 'order' | 'achieved'>, id?: string) => void;
    item: VisionBoardItem | null;
    years: number[];
    defaultYear: number;
    categories: VisionBoardCategory[];
}> = ({ isOpen, onClose, onSave, item, years, defaultYear, categories }) => {
    const [formState, setFormState] = useState({ title: '', notes: '', imageUrl: '', year: defaultYear, categoryId: '' });
    const [addType, setAddType] = useState<'upload' | 'url'>('url');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (item) {
                setFormState({ title: item.title, notes: item.notes || '', imageUrl: item.imageUrl, year: item.year, categoryId: item.categoryId || '' });
                setImagePreview(item.imageUrl);
            } else {
                setFormState({ title: '', notes: '', imageUrl: '', year: defaultYear, categoryId: '' });
                setImagePreview(null);
            }
        }
    }, [isOpen, item, defaultYear]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setFormState(prev => ({ ...prev, imageUrl: result }));
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setFormState(prev => ({ ...prev, imageUrl: url }));
        if(url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null) {
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    };
    
    const handleSave = () => {
        if (!formState.title || !formState.imageUrl) {
            alert('Please provide a title and an image URL or upload.');
            return;
        }
        onSave({ title: formState.title, notes: formState.notes, imageUrl: formState.imageUrl, year: formState.year, categoryId: formState.categoryId || undefined }, item?.id);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Vision' : 'Add to Vision Board'}>
            <div className="space-y-4">
                <div className="p-1 rounded-lg flex bg-slate-100 dark:bg-slate-700 w-full">
                    <button onClick={() => setAddType('url')} className={`w-1/2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${addType === 'url' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500'}`}><Link size={16}/> From URL</button>
                    <button onClick={() => setAddType('upload')} className={`w-1/2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${addType === 'upload' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500'}`}><UploadCloud size={16}/> Upload</button>
                </div>
                
                {addType === 'url' ? (
                     <div>
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <input type="text" value={formState.imageUrl.startsWith('data:') ? '' : formState.imageUrl} onChange={handleUrlChange} placeholder="https://pinterest.com/pin/... or any image URL" className="w-full px-3 py-2 border rounded-md" />
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium mb-1">Upload Image</label>
                        <div onClick={() => fileInputRef.current?.click()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-slate-400">
                           <div className="space-y-1 text-center">
                               <UploadCloud size={32} className="mx-auto text-slate-400" />
                               <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                           </div>
                           <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </div>
                    </div>
                )}

                {imagePreview && (
                    <div className="text-center bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                        <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-md" />
                    </div>
                )}
                
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3">
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input type="text" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium mb-1">Year</label>
                        <select value={formState.year} onChange={e => setFormState({...formState, year: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-md appearance-none">
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select value={formState.categoryId} onChange={e => setFormState({...formState, categoryId: e.target.value})} className="w-full px-3 py-2 border rounded-md appearance-none">
                            <option value="">Uncategorized</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                    <textarea value={formState.notes} onChange={e => setFormState({...formState, notes: e.target.value})} rows={2} className="w-full px-3 py-2 border rounded-md" />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white">{item ? 'Save Changes' : 'Add Vision'}</button>
                </div>
            </div>
        </Modal>
    );
};

export const VisionBoardPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const { visionBoardItems, visionBoardCategories, addVisionBoardItem, updateVisionBoardItem, deleteVisionBoardItem, setVisionBoardItems, loading } = useData();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [achievedFilter, setAchievedFilter] = useState<'all' | 'todo' | 'achieved'>('todo');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<VisionBoardItem | null>(null);
    const [dragId, setDragId] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const visionBoardRef = useRef<HTMLDivElement>(null);

    const categoryMap = useMemo(() => new Map(visionBoardCategories.map(c => [c.id, c])), [visionBoardCategories]);

    const years = useMemo(() => {
        const allYears = new Set(visionBoardItems.map(i => i.year));
        const currentYear = new Date().getFullYear();
        allYears.add(currentYear);
        for (let i = 1; i <= 5; i++) {
            allYears.add(currentYear + i);
        }
        return Array.from(allYears).sort((a,b) => a - b);
    }, [visionBoardItems]);

    const handleExportPdf = async () => {
        if (!visionBoardRef.current) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(visionBoardRef.current, { scale: 2, useCORS: true, backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#f1f5f9' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: [canvas.width, canvas.height] });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`vision-board-${selectedYear}${selectedCategory !== 'all' ? '-' + categoryMap.get(selectedCategory)?.name : ''}.pdf`);
        } catch (error) {
            console.error("Failed to export PDF:", error);
            alert("Could not export to PDF. Some images may not be accessible.");
        } finally {
            setIsExporting(false);
        }
    };

    useEffect(() => {
        setHeaderActions(
            <div className="flex items-center gap-4">
                <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value, 10))} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-colors">
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <button onClick={handleExportPdf} disabled={isExporting} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 border dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50">
                    {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                    <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
                </button>
                <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300">
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Image</span>
                </button>
            </div>
        );
        return () => setHeaderActions(null);
    }, [setHeaderActions, selectedYear, years, isExporting]);

    const itemsForYear = useMemo(() => {
        return visionBoardItems
            .filter(item => item.year === selectedYear)
            .filter(item => selectedCategory === 'all' || item.categoryId === selectedCategory)
            .filter(item => {
                if (achievedFilter === 'todo') return !item.achieved;
                if (achievedFilter === 'achieved') return !!item.achieved;
                return true; // 'all'
            })
            .sort((a,b) => a.order - b.order);
    }, [visionBoardItems, selectedYear, selectedCategory, achievedFilter]);

    const totalItemsForYearAndCategory = useMemo(() => {
        return visionBoardItems
            .filter(item => item.year === selectedYear)
            .filter(item => selectedCategory === 'all' || item.categoryId === selectedCategory)
            .length;
    }, [visionBoardItems, selectedYear, selectedCategory]);

    const handleEdit = (item: VisionBoardItem) => { setEditingItem(item); setIsModalOpen(true); };
    const handleDelete = (id: string) => { if (window.confirm('Are you sure you want to remove this image?')) { deleteVisionBoardItem(id); }};
    const handleToggleAchieved = (item: VisionBoardItem) => {
        updateVisionBoardItem({ ...item, achieved: !item.achieved });
    };

    const handleSave = (itemData: Omit<VisionBoardItem, 'id' | 'order' | 'achieved'>, id?: string) => {
        if (id) {
            const originalItem = visionBoardItems.find(i => i.id === id)!;
            updateVisionBoardItem({ ...originalItem, ...itemData });
        } else {
            const newOrder = itemsForYear.length > 0 ? Math.max(...itemsForYear.map(i => i.order)) + 1 : 0;
            addVisionBoardItem({ ...itemData, order: newOrder, achieved: false });
        }
    };

    const handleDragStart = (id: string) => setDragId(id);
    const handleDragEnd = () => setDragId(null);
    const handleDrop = (targetItem: VisionBoardItem) => {
        if (!dragId || dragId === targetItem.id) return;
        const currentItems = [...itemsForYear];
        const draggedItem = currentItems.find(p => p.id === dragId);
        if (!draggedItem) return;
        const reordered = currentItems.filter(p => p.id !== dragId);
        const targetIndex = reordered.findIndex(p => p.id === targetItem.id);
        reordered.splice(targetIndex, 0, draggedItem);
        const reorderedItemsForYear = reordered.map((item, index) => ({ ...item, order: index }));
        const otherItems = visionBoardItems.filter(item => !itemsForYear.some(i => i.id === item.id));
        setVisionBoardItems([...otherItems, ...reorderedItemsForYear]);
        setDragId(null);
    };

    if (loading) return <div className="text-center p-10">Loading your vision...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Vision Board: {selectedYear}</h1>
            
            <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1.5 text-sm font-semibold rounded-full border-2 ${selectedCategory === 'all' ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-slate-500'}`}>All</button>
                {visionBoardCategories.map(cat => {
                    const isActive = selectedCategory === cat.id;
                    const activeClass = `${colorClasses[cat.color]?.bg} ${colorClasses[cat.color]?.text.replace('dark:text-','dark:text-white')} border-transparent`;
                    const inactiveClass = `bg-white text-slate-600 border-slate-200 hover:border-slate-400 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-slate-500`;
                    return (
                        <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-3 py-1.5 text-sm font-semibold rounded-full border-2 ${isActive ? activeClass : inactiveClass}`}>
                            {cat.name}
                        </button>
                    )
                })}
                <div className="flex items-center gap-2 flex-wrap border-l border-slate-200 dark:border-slate-700 pl-4 ml-2">
                    <button onClick={() => setAchievedFilter('todo')} className={`px-3 py-1.5 text-sm font-semibold rounded-full border-2 ${achievedFilter === 'todo' ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-slate-500'}`}>To Do</button>
                    <button onClick={() => setAchievedFilter('achieved')} className={`px-3 py-1.5 text-sm font-semibold rounded-full border-2 ${achievedFilter === 'achieved' ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-slate-500'}`}>Achieved</button>
                    <button onClick={() => setAchievedFilter('all')} className={`px-3 py-1.5 text-sm font-semibold rounded-full border-2 ${achievedFilter === 'all' ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-slate-500'}`}>All</button>
                </div>
            </div>

            {itemsForYear.length > 0 ? (
                <div ref={visionBoardRef} className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 space-y-4">
                    {itemsForYear.map(item => (
                        <VisionBoardCard
                            key={item.id}
                            item={item}
                            category={item.categoryId ? categoryMap.get(item.categoryId) : undefined}
                            isDragging={dragId === item.id}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item.id)}
                            onToggleAchieved={() => handleToggleAchieved(item)}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDrop={handleDrop}
                        />
                    ))}
                </div>
            ) : (
                <Card className="text-center py-20 border-2 border-dashed">
                    <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                    {totalItemsForYearAndCategory === 0 ? (
                        <>
                            <h3 className="mt-4 text-lg font-semibold">Your Vision Board is Empty</h3>
                            <p className="mt-1 text-sm text-slate-500">Add an image to start manifesting your goals for {selectedYear}{selectedCategory !== 'all' ? ` in ${categoryMap.get(selectedCategory)?.name}` : ''}.</p>
                        </>
                    ) : achievedFilter === 'achieved' ? (
                        <>
                            <h3 className="mt-4 text-lg font-semibold">No Achieved Visions Yet</h3>
                            <p className="mt-1 text-sm text-slate-500">Mark an item as complete to see it here.</p>
                        </>
                    ) : ( // achievedFilter === 'todo'
                        <>
                            <h3 className="mt-4 text-lg font-semibold">All Done for Now!</h3>
                            <p className="mt-1 text-sm text-slate-500">You've achieved all your visions for this selection. Great job!</p>
                        </>
                    )}
                </Card>
            )}

            <VisionBoardItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                item={editingItem}
                years={years}
                defaultYear={selectedYear}
                categories={visionBoardCategories}
            />
        </div>
    );
};