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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-black/50 mb-1 inline-block">{review.category}</span>
                <h3 className="font-bold text-lg">{review.title}</h3>
                <p className="text-sm opacity-90">{review.author}</p>
            </div>
        </div>
        <div className="p-4 border-t dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 h-16 overflow-hidden">{review.tagline}</p>
        </div>
    </Card>
);


// --- PAGE COMPONENT ---
export const BookReviewsPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const { bookReviews, addBookReview, updateBookReview, loading } = useData();
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<BookReview | null>(null);

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
            
            {bookReviews.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {bookReviews.map(review => (
                        <BookReviewCard key={review.id} review={review} onClick={() => handleViewDetails(review)} />
                    ))}
                </div>
            ) : (
                <Card className="text-center py-20 border-2 border-dashed">
                    <Book className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="text-lg font-semibold">No Book Reviews Yet</h3>
                    <p className="mt-1 text-sm text-slate-500">Click "Add Review" to start sharing your thoughts.</p>
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
