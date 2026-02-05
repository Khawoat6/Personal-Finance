import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Book } from 'lucide-react';
import type { BookReview } from '../types';
import { BookReviewFormModal } from '../components/features/BookReviewFormModal';


// --- MAIN PAGE & CARD VIEW ---
const BookReviewCard: React.FC<{ review: BookReview; onClick: () => void }> = ({ review, onClick }) => (
    <Card onClick={onClick} className="p-0 cursor-pointer overflow-hidden transform hover:-translate-y-1 transition-transform duration-200 group">
        <div className="aspect-[2/3] relative">
            <img src={review.coverImageUrl} alt={review.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/90 transition-colors"></div>
            <div className="absolute bottom-0 left-0 p-3 text-white w-full">
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-black/50 mb-1 inline-block">{review.category}</span>
                <h3 className="font-bold text-md leading-tight">{review.title}</h3>
                <p className="text-xs opacity-80">{review.author}</p>
            </div>
        </div>
    </Card>
);

const selectClass = "w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-colors";

// --- PAGE COMPONENT ---
export const BookReviewsPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const { bookReviews, addBookReview, updateBookReview, loading } = useData();
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<BookReview | null>(null);
    
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterDifficulty, setFilterDifficulty] = useState('all');
    const [sortBy, setSortBy] = useState('dateRead-desc');

    const categories = useMemo(() => Array.from(new Set(bookReviews.map(r => r.category))).sort(), [bookReviews]);
    const difficulties = useMemo(() => Array.from(new Set(bookReviews.map(r => r.difficulty))).sort(), [bookReviews]);

    const processedReviews = useMemo(() => {
        return bookReviews
            .filter(review => {
                const categoryMatch = filterCategory === 'all' || review.category === filterCategory;
                const difficultyMatch = filterDifficulty === 'all' || review.difficulty === filterDifficulty;
                return categoryMatch && difficultyMatch;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'dateRead-desc':
                        return new Date(b.dateRead).getTime() - new Date(a.dateRead).getTime();
                    case 'dateRead-asc':
                        return new Date(a.dateRead).getTime() - new Date(b.dateRead).getTime();
                    case 'title-asc':
                        return a.title.localeCompare(b.title);
                    case 'title-desc':
                        return b.title.localeCompare(a.title);
                    case 'author-asc':
                        return a.author.localeCompare(b.author);
                    case 'author-desc':
                        return b.author.localeCompare(a.author);
                    default:
                        return 0;
                }
            });
    }, [bookReviews, filterCategory, filterDifficulty, sortBy]);

    useEffect(() => {
        setHeaderActions(
            <button onClick={() => { setEditingReview(null); setIsFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300">
                <PlusCircle className="h-4 w-4" />
                <span>Add Review</span>
            </button>
        );
        return () => setHeaderActions(null);
    }, [setHeaderActions]);

    const handleViewDetails = (review: BookReview) => {
        navigate(`/reviews/${review.id}`);
    };
    
    const handleSave = (data: BookReview, id?: string) => {
        if (id) {
            updateBookReview({ ...data, id });
        } else {
            addBookReview(data);
        }
    };
    
    if (loading) return <p>Loading book reviews...</p>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Book Reviews</h1>
            
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className={selectClass}>
                        <option value="all">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)} className={selectClass}>
                        <option value="all">All Difficulties</option>
                        {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectClass}>
                        <option value="dateRead-desc">Date Read (Newest)</option>
                        <option value="dateRead-asc">Date Read (Oldest)</option>
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="title-desc">Title (Z-A)</option>
                        <option value="author-asc">Author (A-Z)</option>
                        <option value="author-desc">Author (Z-A)</option>
                    </select>
                </div>
            </Card>

            {processedReviews.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {processedReviews.map(review => (
                        <BookReviewCard key={review.id} review={review} onClick={() => handleViewDetails(review)} />
                    ))}
                </div>
            ) : (
                <Card className="text-center py-20 border-2 border-dashed">
                    <Book className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="text-lg font-semibold">No Book Reviews Found</h3>
                    <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or add a new review.</p>
                </Card>
            )}
            
             <BookReviewFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                review={editingReview}
                onSave={handleSave}
            />
        </div>
    );
};