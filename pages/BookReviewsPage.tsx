import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Book, Search, LayoutGrid, Share2, CalendarDays, GanttChartSquare, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { BookReview } from '../types';
import { BookReviewFormModal } from '../components/features/BookReviewFormModal';

type ViewMode = 'card' | 'calendar' | 'timeline' | 'graph';

// --- CARD VIEW ---
const BookReviewCard: React.FC<{ review: BookReview; onClick: () => void }> = ({ review, onClick }) => (
    <div onClick={onClick} className="p-0 cursor-pointer overflow-hidden rounded-xl transform hover:-translate-y-1 transition-transform duration-200 group aspect-[2/3] relative shadow-md">
        <img src={review.coverImageUrl} alt={review.title} className="w-full h-full object-cover absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-black/50 mb-1 inline-block">{review.category}</span>
                <h3 className="font-bold text-sm leading-tight">{review.title}</h3>
                <p className="text-xs opacity-80">{review.author}</p>
            </div>
        </div>
    </div>
);

const CardView: React.FC<{ reviews: BookReview[]; onViewDetails: (review: BookReview) => void }> = ({ reviews, onViewDetails }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {reviews.map(review => (
            <BookReviewCard key={review.id} review={review} onClick={() => onViewDetails(review)} />
        ))}
    </div>
);

// --- OTHER VIEWS ---
const GraphView: React.FC = () => (
    <Card className="text-center py-20 border-2 border-dashed">
        <Share2 className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="text-lg font-semibold">Graph View Coming Soon</h3>
        <p className="mt-1 text-sm text-slate-500">Visualize connections between your readings.</p>
    </Card>
);

const MonthGrid: React.FC<{ year: number; month: number; reviews: BookReview[]; onReviewClick: (review: BookReview) => void;}> = ({ year, month, reviews, onReviewClick }) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const reviewsByDay = useMemo(() => {
        const map = new Map<number, BookReview[]>();
        reviews.forEach(review => {
            const readDate = new Date(review.dateRead);
            if (readDate.getFullYear() === year && readDate.getMonth() === month) {
                const day = readDate.getDate();
                if (!map.has(day)) map.set(day, []);
                map.get(day)!.push(review);
            }
        });
        return map;
    }, [reviews, year, month]);

    return (
        <div>
            <h3 className="font-semibold text-center mb-2">{new Date(year, month).toLocaleString('default', { month: 'long' })}</h3>
            <div className="grid grid-cols-7 gap-1 text-xs text-center text-slate-500 dark:text-slate-400">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 mt-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayReviews = reviewsByDay.get(day);
                    return (
                        <div key={day} className="relative aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-md p-1">
                            <span className="font-medium text-slate-700 dark:text-slate-300 text-xs">{day}</span>
                            {dayReviews && (
                                <div className="absolute inset-0 flex items-center justify-center p-1">
                                    <img 
                                        src={dayReviews[0].coverImageUrl} 
                                        alt={dayReviews[0].title}
                                        onClick={() => onReviewClick(dayReviews[0])}
                                        className="w-full h-full object-cover rounded-sm cursor-pointer shadow-lg hover:scale-150 hover:z-10 transition-transform"
                                        title={dayReviews.map(r => r.title).join(', ')}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const CalendarView: React.FC<{ reviews: BookReview[]; onViewDetails: (review: BookReview) => void }> = ({ reviews, onViewDetails }) => {
    const [year, setYear] = useState(new Date().getFullYear());
    return (
         <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Reading Calendar</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => setYear(y => y - 1)} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronLeft size={18}/></button>
                    <span className="font-semibold w-20 text-center">{year}</span>
                    <button onClick={() => setYear(y => y + 1)} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronRight size={18}/></button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <MonthGrid key={i} year={year} month={i} reviews={reviews} onReviewClick={onViewDetails}/>
                ))}
            </div>
        </Card>
    );
};

const TimelineView: React.FC<{ reviews: BookReview[]; onViewDetails: (review: BookReview) => void }> = ({ reviews, onViewDetails }) => {
    const reviewsByYearMonth = useMemo(() => {
        const grouped: { [year: string]: { [month: string]: BookReview[] } } = {};
        reviews.forEach(review => {
            const date = new Date(review.dateRead);
            const year = date.getFullYear();
            const month = date.getMonth();
            if (!grouped[year]) grouped[year] = {};
            if (!grouped[year][month]) grouped[year][month] = [];
            grouped[year][month].push(review);
        });
        return grouped;
    }, [reviews]);

    const sortedYears = Object.keys(reviewsByYearMonth).sort((a,b) => parseInt(b) - parseInt(a));

    return (
        <div className="space-y-8">
            {sortedYears.map(year => (
                <div key={year}>
                    <h2 className="text-3xl font-serif font-bold sticky top-20 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm py-2 z-10">{year}</h2>
                    <div className="mt-4 space-y-6">
                        {Object.keys(reviewsByYearMonth[year]).sort((a,b) => parseInt(b) - parseInt(a)).map(month => (
                             <div key={month} className="grid grid-cols-[auto,1fr] gap-6 relative">
                                <div className="absolute left-10 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                                <div className="flex items-start">
                                    <div className="w-20 font-semibold text-right text-sm text-slate-500 dark:text-slate-400">{new Date(parseInt(year), parseInt(month)).toLocaleString('default', { month: 'long' })}</div>
                                    <div className="ml-4 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 border-4 border-slate-50 dark:border-slate-900 z-10 mt-1"></div>
                                </div>
                                <div className="flex flex-wrap gap-4 pb-4">
                                     {reviewsByYearMonth[year][month].map(review => (
                                         <div key={review.id} onClick={() => onViewDetails(review)} className="cursor-pointer group">
                                            <img src={review.coverImageUrl} alt={review.title} className="h-40 w-auto rounded-md shadow-lg transform transition-transform group-hover:-translate-y-1"/>
                                            <p className="text-xs font-semibold mt-2 max-w-[100px] truncate">{review.title}</p>
                                         </div>
                                     ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- CONTROLS ---
const ViewSwitcher: React.FC<{ viewMode: ViewMode; setViewMode: (mode: ViewMode) => void }> = ({ viewMode, setViewMode }) => {
    const views = [ { id: 'card', icon: LayoutGrid }, { id: 'calendar', icon: CalendarDays }, { id: 'timeline', icon: GanttChartSquare }, { id: 'graph', icon: Share2 } ];
    return (
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            {views.map(({ id, icon: Icon }) => (
                <button key={id} onClick={() => setViewMode(id as ViewMode)} className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${viewMode === id ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`} >
                    <Icon size={16} /> <span className="hidden sm:inline capitalize">{id}</span>
                </button>
            ))}
        </div>
    );
};

const FilterDropdown: React.FC<{ value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; title: string; }> = ({ value, onChange, options, title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selectedLabel = options.find(o => o.value === value)?.label || title;
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false); };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
               <span className="truncate">{selectedLabel}</span> <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border dark:border-slate-700 z-20 max-h-60 overflow-y-auto">
                    <div className="p-1">{options.map(option => (
                        <button key={option.value} onClick={() => { onChange(option.value); setIsOpen(false); }} className="w-full px-2 py-1.5 text-sm rounded-md text-left hover:bg-slate-100 dark:hover:bg-slate-700">{option.label}</button>
                    ))}</div>
                </div>
            )}
        </div>
    );
};


// --- PAGE COMPONENT ---
export const BookReviewsPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const { bookReviews, addBookReview, updateBookReview, loading } = useData();
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<BookReview | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('card');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterDifficulty, setFilterDifficulty] = useState('all');
    const [sortBy, setSortBy] = useState('dateRead-desc');

    const categories = useMemo(() => [{value: 'all', label: 'All Categories'}, ...Array.from(new Set(bookReviews.map(r => r.category))).sort().map(c => ({value: c, label: c}))], [bookReviews]);
    const difficulties = useMemo(() => [{value: 'all', label: 'All Difficulties'}, ...Array.from(new Set(bookReviews.map(r => r.difficulty))).sort().map(d => ({value: d, label: d}))], [bookReviews]);
    const sortOptions = [
        { value: 'dateRead-desc', label: 'Date Read (Newest)' }, { value: 'dateRead-asc', label: 'Date Read (Oldest)' },
        { value: 'title-asc', label: 'Title (A-Z)' }, { value: 'title-desc', label: 'Title (Z-A)' },
        { value: 'author-asc', label: 'Author (A-Z)' }, { value: 'author-desc', label: 'Author (Z-A)' },
    ];

    const processedReviews = useMemo(() => {
        return bookReviews
            .filter(review => {
                const searchMatch = searchTerm === '' || review.title.toLowerCase().includes(searchTerm.toLowerCase()) || review.author.toLowerCase().includes(searchTerm.toLowerCase());
                const categoryMatch = filterCategory === 'all' || review.category === filterCategory;
                const difficultyMatch = filterDifficulty === 'all' || review.difficulty === filterDifficulty;
                return searchMatch && categoryMatch && difficultyMatch;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'dateRead-desc': return new Date(b.dateRead).getTime() - new Date(a.dateRead).getTime();
                    case 'dateRead-asc': return new Date(a.dateRead).getTime() - new Date(b.dateRead).getTime();
                    case 'title-asc': return a.title.localeCompare(b.title);
                    case 'title-desc': return b.title.localeCompare(a.title);
                    case 'author-asc': return a.author.localeCompare(b.author);
                    case 'author-desc': return b.author.localeCompare(a.author);
                    default: return 0;
                }
            });
    }, [bookReviews, searchTerm, filterCategory, filterDifficulty, sortBy]);

    useEffect(() => {
        setHeaderActions(
            <button onClick={() => { setEditingReview(null); setIsFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300">
                <PlusCircle className="h-4 w-4" /> <span>Add Review</span>
            </button>
        );
        return () => setHeaderActions(null);
    }, [setHeaderActions]);

    const handleViewDetails = (review: BookReview) => navigate(`/reviews/${review.id}`);
    const handleSave = (data: BookReview, id?: string) => { if (id) updateBookReview({ ...data, id }); else addBookReview(data); };
    
    if (loading) return <p>Loading book reviews...</p>;

    const renderView = () => {
        if (processedReviews.length === 0) {
            return (
                <Card className="text-center py-20 border-2 border-dashed">
                    <Book className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="text-lg font-semibold">No Book Reviews Found</h3>
                    <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or add a new review.</p>
                </Card>
            );
        }
        switch(viewMode) {
            case 'card': return <CardView reviews={processedReviews} onViewDetails={handleViewDetails} />;
            case 'calendar': return <CalendarView reviews={processedReviews} onViewDetails={handleViewDetails} />;
            case 'timeline': return <TimelineView reviews={processedReviews} onViewDetails={handleViewDetails} />;
            case 'graph': return <GraphView />;
            default: return null;
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Book Reviews</h1>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-40 pl-9 pr-3 py-1.5 border rounded-lg text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"/></div>
                    <FilterDropdown title="Category" value={filterCategory} onChange={setFilterCategory} options={categories} />
                    <FilterDropdown title="Difficulty" value={filterDifficulty} onChange={setFilterDifficulty} options={difficulties} />
                    <FilterDropdown title="Sort By" value={sortBy} onChange={setSortBy} options={sortOptions} />
                </div>
                <ViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            {renderView()}
            
             <BookReviewFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} review={editingReview} onSave={handleSave} />
        </div>
    );
};