import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { PlusCircle, Image as ImageIcon, Edit, Trash2, UploadCloud, Link, GripVertical } from 'lucide-react';
import type { VisionBoardItem } from '../types';

const VisionBoardCard: React.FC<{
    item: VisionBoardItem;
    isDragging: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onDragStart: (id: string) => void;
    onDragEnd: () => void;
    onDrop: (item: VisionBoardItem) => void;
}> = ({ item, isDragging, onEdit, onDelete, onDragStart, onDragEnd, onDrop }) => {
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
                        ${isDragOver ? 'ring-2 ring-sky-500 ring-offset-2' : ''}`}
        >
            <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                    <h3 className="font-bold text-base truncate">{item.title}</h3>
                    {item.notes && <p className="text-xs opacity-80 truncate">{item.notes}</p>}
                </div>
                 <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="cursor-grab p-2 rounded-full bg-black/40 hover:bg-black/60" title="Drag to reorder">
                        <GripVertical size={16} />
                    </div>
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
    onSave: (item: Omit<VisionBoardItem, 'id' | 'order'>, id?: string) => void;
    item: VisionBoardItem | null;
    years: number[];
    defaultYear: number;
}> = ({ isOpen, onClose, onSave, item, years, defaultYear }) => {
    const [formState, setFormState] = useState({ title: '', notes: '', imageUrl: '', year: defaultYear });
    const [addType, setAddType] = useState<'upload' | 'url'>('url');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (item) {
                setFormState({ title: item.title, notes: item.notes || '', imageUrl: item.imageUrl, year: item.year });
                setImagePreview(item.imageUrl);
            } else {
                setFormState({ title: '', notes: '', imageUrl: '', year: defaultYear });
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
        // simple validation to show preview
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
        onSave({ title: formState.title, notes: formState.notes, imageUrl: formState.imageUrl, year: formState.year }, item?.id);
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
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input type="text" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} className="w-full px-3 py-2 border rounded-md" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Year</label>
                        <select value={formState.year} onChange={e => setFormState({...formState, year: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-md appearance-none">
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
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
    const { visionBoardItems, addVisionBoardItem, updateVisionBoardItem, deleteVisionBoardItem, setVisionBoardItems, loading } = useData();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<VisionBoardItem | null>(null);
    const [dragId, setDragId] = useState<string | null>(null);

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 6 }, (_, i) => currentYear + i);
    }, []);

    useEffect(() => {
        setHeaderActions(
            <div className="flex items-center gap-4">
                <select 
                    value={selectedYear} 
                    onChange={e => setSelectedYear(parseInt(e.target.value, 10))}
                    className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-colors"
                >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <button
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300"
                >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Image</span>
                </button>
            </div>
        );
        return () => setHeaderActions(null);
    }, [setHeaderActions, selectedYear, years]);

    const itemsForYear = useMemo(() => {
        return visionBoardItems.filter(item => item.year === selectedYear).sort((a,b) => a.order - b.order);
    }, [visionBoardItems, selectedYear]);

    const handleEdit = (item: VisionBoardItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to remove this image from your vision board?')) {
            deleteVisionBoardItem(id);
        }
    };
    
    const handleSave = (itemData: Omit<VisionBoardItem, 'id' | 'order'>, id?: string) => {
        if (id) {
            const originalItem = visionBoardItems.find(i => i.id === id)!;
            let newItemDataWithOrder: VisionBoardItem;
            
            if (originalItem.year !== itemData.year) {
                const newYearItems = visionBoardItems.filter(i => i.year === itemData.year && i.id !== id);
                const newOrder = newYearItems.length > 0 ? Math.max(-1, ...newYearItems.map(i => i.order)) + 1 : 0;
                newItemDataWithOrder = { ...originalItem, ...itemData, order: newOrder };
            } else {
                 newItemDataWithOrder = { ...originalItem, ...itemData };
            }
            updateVisionBoardItem(newItemDataWithOrder);
        } else {
            const newOrder = itemsForYear.length;
            addVisionBoardItem({ ...itemData, order: newOrder });
        }
    };

    const handleDragStart = (id: string) => setDragId(id);
    const handleDragEnd = () => setDragId(null);
    const handleDrop = (targetItem: VisionBoardItem) => {
        if (!dragId || dragId === targetItem.id) return;

        const currentItems = [...itemsForYear];
        const draggedItemIndex = currentItems.findIndex(p => p.id === dragId);
        const targetItemIndex = currentItems.findIndex(p => p.id === targetItem.id);

        if (draggedItemIndex === -1 || targetItemIndex === -1) return;

        const [draggedItem] = currentItems.splice(draggedItemIndex, 1);
        currentItems.splice(targetItemIndex, 0, draggedItem);

        const reorderedItemsForYear = currentItems.map((item, index) => ({ ...item, order: index }));
        const otherYearItems = visionBoardItems.filter(item => item.year !== selectedYear);
        
        setVisionBoardItems([...otherYearItems, ...reorderedItemsForYear]);
        setDragId(null);
    };

    if (loading) return <div className="text-center p-10">Loading your vision...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Vision Board: {selectedYear}</h1>

            {itemsForYear.length > 0 ? (
                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 space-y-4">
                    {itemsForYear.map(item => (
                        <VisionBoardCard
                            key={item.id}
                            item={item}
                            isDragging={dragId === item.id}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item.id)}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDrop={handleDrop}
                        />
                    ))}
                </div>
            ) : (
                <Card className="text-center py-20 border-2 border-dashed">
                    <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-4 text-lg font-semibold">Your Vision Board is Empty</h3>
                    <p className="mt-1 text-sm text-slate-500">Add your first image to start manifesting your goals for {selectedYear}.</p>
                </Card>
            )}

            <VisionBoardItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                item={editingItem}
                years={years}
                defaultYear={selectedYear}
            />
        </div>
    );
};