import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import type { BookReview } from '../../types';
import { MinusCircle } from 'lucide-react';

const FormSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="space-y-2 pt-4 border-t dark:border-slate-700">
        <h3 className="text-base font-semibold">{title}</h3>
        {children}
    </div>
);

const newReviewTemplate: Omit<BookReview, 'id'> = {
    title: '', author: '', coverImageUrl: '', category: 'Finance', readingTime: 0, difficulty: 'Intermediate', tagline: '', 
    keyTakeaways: [''], 
    coreIdeas: [{ concept: '', explanation: '', relevance: '' }], 
    frameworks: [{ name: '', description: '' }], 
    quotes: [{ text: '', context: '' }], 
    reflections: '', 
    whoShouldRead: [''], 
    qualitativeRating: { insightDepth: 3, practicality: 3, timelessness: 3 }, 
    verdict: '', 
    dateRead: new Date().toISOString()
};

export const BookReviewFormModal: React.FC<{ review: BookReview | null; isOpen: boolean; onClose: () => void; onSave: (data: BookReview, id?: string) => void; }> = ({ review, isOpen, onClose, onSave }) => {
    const [formState, setFormState] = useState<BookReview | Omit<BookReview, 'id'>>(newReviewTemplate);
    
    useEffect(() => {
        if (isOpen) {
            setFormState(review ? JSON.parse(JSON.stringify(review)) : newReviewTemplate);
        }
    }, [review, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: ['readingTime'].includes(name) ? parseInt(value) || 0 : value }));
    };
    
    const handleQualitativeRatingChange = (field: 'insightDepth' | 'practicality' | 'timelessness', value: number) => {
        setFormState(prev => ({ ...prev, qualitativeRating: { ...prev.qualitativeRating, [field]: value }}));
    };

    const handleDynamicListChange = (field: 'keyTakeaways' | 'whoShouldRead', index: number, value: string) => {
        setFormState(prev => {
            const newList = [...(prev[field] as string[])];
            newList[index] = value;
            return { ...prev, [field]: newList };
        });
    };
    const addDynamicListItem = (field: 'keyTakeaways' | 'whoShouldRead') => {
        setFormState(prev => ({ ...prev, [field]: [...(prev[field] as string[]), ''] }));
    };
    const removeDynamicListItem = (field: 'keyTakeaways' | 'whoShouldRead', index: number) => {
        setFormState(prev => ({ ...prev, [field]: (prev[field] as string[]).filter((_, i) => i !== index) }));
    };

    const handleCoreIdeaChange = (index: number, field: keyof BookReview['coreIdeas'][0], value: string) => {
        setFormState(prev => { const newCoreIdeas = [...prev.coreIdeas]; newCoreIdeas[index] = { ...newCoreIdeas[index], [field]: value }; return { ...prev, coreIdeas: newCoreIdeas }; });
    };
    const addCoreIdea = () => setFormState(prev => ({ ...prev, coreIdeas: [...prev.coreIdeas, { concept: '', explanation: '', relevance: '' }] }));
    const removeCoreIdea = (index: number) => setFormState(prev => ({ ...prev, coreIdeas: prev.coreIdeas.filter((_, i) => i !== index) }));

    const handleFrameworkChange = (index: number, field: keyof BookReview['frameworks'][0], value: string) => {
        setFormState(prev => { const newFrameworks = [...prev.frameworks]; newFrameworks[index] = { ...newFrameworks[index], [field]: value }; return { ...prev, frameworks: newFrameworks }; });
    };
    const addFramework = () => setFormState(prev => ({ ...prev, frameworks: [...prev.frameworks, { name: '', description: '' }] }));
    const removeFramework = (index: number) => setFormState(prev => ({ ...prev, frameworks: prev.frameworks.filter((_, i) => i !== index) }));

    const handleQuoteChange = (index: number, field: keyof BookReview['quotes'][0], value: string) => {
        setFormState(prev => { const newQuotes = [...prev.quotes]; newQuotes[index] = { ...newQuotes[index], [field]: value }; return { ...prev, quotes: newQuotes }; });
    };
    const addQuote = () => setFormState(prev => ({ ...prev, quotes: [...prev.quotes, { text: '', context: '' }] }));
    const removeQuote = (index: number) => setFormState(prev => ({ ...prev, quotes: prev.quotes.filter((_, i) => i !== index) }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState as BookReview, 'id' in formState ? formState.id : undefined);
        onClose();
    };

    return (
         <Modal isOpen={isOpen} onClose={onClose} title={review ? "Edit Review" : "Add New Book Review"} maxWidth="max-w-3xl">
             <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div><label className="block text-sm font-medium mb-1">Title</label><input name="title" value={formState.title} onChange={handleChange} className="w-full p-2 border rounded-md" required /></div>
                     <div><label className="block text-sm font-medium mb-1">Author</label><input name="author" value={formState.author} onChange={handleChange} className="w-full p-2 border rounded-md" required /></div>
                 </div>
                  <div><label className="block text-sm font-medium mb-1">Cover Image URL</label><input name="coverImageUrl" value={formState.coverImageUrl} onChange={handleChange} className="w-full p-2 border rounded-md" required /></div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Category</label><select name="category" value={formState.category} onChange={handleChange} className="w-full p-2 border rounded-md"><option>Business</option><option>Philosophy</option><option>Finance</option><option>Psychology</option><option>History</option><option>Self-Help</option></select></div>
                    <div><label className="block text-sm font-medium mb-1">Reading Time (min)</label><input type="number" name="readingTime" value={formState.readingTime} onChange={handleChange} className="w-full p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium mb-1">Difficulty</label><select name="difficulty" value={formState.difficulty} onChange={handleChange} className="w-full p-2 border rounded-md"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
                 </div>
                 
                  <div><label className="block text-sm font-medium mb-1">Tagline</label><input name="tagline" value={formState.tagline} onChange={handleChange} className="w-full p-2 border rounded-md" /></div>

                <FormSection title="Key Takeaways">
                    <div className="space-y-2">{formState.keyTakeaways.map((item, index) => (
                        <div key={index} className="flex items-center gap-2"><input type="text" value={item} onChange={e => handleDynamicListChange('keyTakeaways', index, e.target.value)} className="w-full p-2 border rounded-md" placeholder="Enter a key takeaway" /><button type="button" onClick={() => removeDynamicListItem('keyTakeaways', index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><MinusCircle size={16}/></button></div>
                    ))}<button type="button" onClick={() => addDynamicListItem('keyTakeaways')} className="text-sm text-sky-600 dark:text-sky-400 font-semibold">+ Add Takeaway</button></div>
                </FormSection>

                <FormSection title="Core Ideas">
                    <div className="space-y-3">{formState.coreIdeas.map((idea, index) => (
                        <div key={index} className="p-3 border rounded-md space-y-2 relative bg-slate-50 dark:bg-slate-800/50">
                            <button type="button" onClick={() => removeCoreIdea(index)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full"><MinusCircle size={16}/></button>
                            <input placeholder="Concept" value={idea.concept} onChange={e => handleCoreIdeaChange(index, 'concept', e.target.value)} className="w-full p-2 border-b bg-transparent" />
                            <textarea placeholder="Explanation" value={idea.explanation} onChange={e => handleCoreIdeaChange(index, 'explanation', e.target.value)} className="w-full p-2 border-b bg-transparent text-sm" rows={2} />
                            <textarea placeholder="Why it matters" value={idea.relevance} onChange={e => handleCoreIdeaChange(index, 'relevance', e.target.value)} className="w-full p-2 bg-transparent text-sm" rows={1} />
                        </div>
                    ))}<button type="button" onClick={addCoreIdea} className="text-sm text-sky-600 dark:text-sky-400 font-semibold">+ Add Core Idea</button></div>
                </FormSection>

                <FormSection title="Frameworks & Mental Models">
                    <div className="space-y-3">{formState.frameworks.map((fw, index) => (
                        <div key={index} className="p-3 border rounded-md space-y-2 relative bg-slate-50 dark:bg-slate-800/50">
                            <button type="button" onClick={() => removeFramework(index)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full"><MinusCircle size={16}/></button>
                            <input placeholder="Framework Name" value={fw.name} onChange={e => handleFrameworkChange(index, 'name', e.target.value)} className="w-full p-2 border-b bg-transparent" />
                            <textarea placeholder="Description" value={fw.description} onChange={e => handleFrameworkChange(index, 'description', e.target.value)} className="w-full p-2 bg-transparent text-sm" rows={2} />
                        </div>
                    ))}<button type="button" onClick={addFramework} className="text-sm text-sky-600 dark:text-sky-400 font-semibold">+ Add Framework</button></div>
                </FormSection>

                <FormSection title="Quotes & Passages">
                    <div className="space-y-3">{formState.quotes.map((quote, index) => (
                        <div key={index} className="p-3 border rounded-md space-y-2 relative bg-slate-50 dark:bg-slate-800/50">
                             <button type="button" onClick={() => removeQuote(index)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full"><MinusCircle size={16}/></button>
                            <textarea placeholder="Quote text..." value={quote.text} onChange={e => handleQuoteChange(index, 'text', e.target.value)} className="w-full p-2 border-b bg-transparent" rows={2} />
                            <input placeholder="Context (e.g., 'On defining wealth')" value={quote.context} onChange={e => handleQuoteChange(index, 'context', e.target.value)} className="w-full p-2 bg-transparent text-sm" />
                        </div>
                    ))}<button type="button" onClick={addQuote} className="text-sm text-sky-600 dark:text-sky-400 font-semibold">+ Add Quote</button></div>
                </FormSection>

                 <FormSection title="Reflections"><textarea name="reflections" value={formState.reflections} onChange={handleChange} rows={4} className="w-full p-2 border rounded-md" /></FormSection>

                <FormSection title="Who Should Read This?">
                    <div className="space-y-2">{formState.whoShouldRead.map((item, index) => (
                        <div key={index} className="flex items-center gap-2"><input type="text" value={item} onChange={e => handleDynamicListChange('whoShouldRead', index, e.target.value)} className="w-full p-2 border rounded-md" placeholder="e.g., Long-term investors" /><button type="button" onClick={() => removeDynamicListItem('whoShouldRead', index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><MinusCircle size={16}/></button></div>
                    ))}<button type="button" onClick={() => addDynamicListItem('whoShouldRead')} className="text-sm text-sky-600 dark:text-sky-400 font-semibold">+ Add Audience</button></div>
                </FormSection>

                <FormSection title="Rating & Verdict">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Insight Depth ({formState.qualitativeRating.insightDepth}/5)</label><input type="range" min="1" max="5" value={formState.qualitativeRating.insightDepth} onChange={e => handleQualitativeRatingChange('insightDepth', Number(e.target.value))} className="w-full" /></div>
                        <div><label className="block text-sm font-medium mb-1">Practicality ({formState.qualitativeRating.practicality}/5)</label><input type="range" min="1" max="5" value={formState.qualitativeRating.practicality} onChange={e => handleQualitativeRatingChange('practicality', Number(e.target.value))} className="w-full" /></div>
                        <div><label className="block text-sm font-medium mb-1">Timelessness ({formState.qualitativeRating.timelessness}/5)</label><input type="range" min="1" max="5" value={formState.qualitativeRating.timelessness} onChange={e => handleQualitativeRatingChange('timelessness', Number(e.target.value))} className="w-full" /></div>
                    </div>
                    <div><label className="block text-sm font-medium mb-1">Verdict</label><input name="verdict" value={formState.verdict} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="A one-sentence conclusion."/></div>
                </FormSection>

                 <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white dark:bg-slate-900 py-4 -mx-6 px-6 border-t dark:border-slate-700">
                     <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md border">Cancel</button>
                     <button type="submit" className="px-4 py-2 text-sm rounded-md bg-slate-800 text-white">{review ? "Save Changes" : "Add Review"}</button>
                 </div>
             </form>
         </Modal>
    );
};
