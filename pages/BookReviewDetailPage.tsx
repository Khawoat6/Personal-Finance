import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { BookReviewFormModal } from '../components/features/BookReviewFormModal';
import { Clock, BarChart, Check, Quote, Lightbulb, BrainCircuit, User, Star, Edit, Trash2, ArrowLeft, FileDown, Loader2 } from 'lucide-react';
import type { BookReview } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const Section: React.FC<{ id: string, icon: React.ElementType, title: string, children: React.ReactNode, className?: string}> = ({ id, icon: Icon, title, children, className }) => (
    <section id={id} className={`py-8 border-b border-slate-200 dark:border-slate-700 ${className}`}>
        <h2 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
            <Icon size={18} /> {title}
        </h2>
        {children}
    </section>
);

const QualitativeRating: React.FC<{ label: string, score: number }> = ({ label, score }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
            <span className="text-sm font-bold">{score}/5</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
            <div className="bg-slate-500 h-1.5 rounded-full" style={{ width: `${(score/5)*100}%` }}></div>
        </div>
    </div>
);

const TableOfContents: React.FC<{ review: BookReview }> = ({ review }) => {
    const tocItems = useMemo(() => {
        const items = [];
        items.push({ id: 'tldr', label: 'Key Takeaways', level: 1 });
        if(review.coreIdeas?.length > 0) {
            items.push({ id: 'core-ideas', label: 'Core Ideas', level: 1, children: review.coreIdeas.map(idea => ({ id: `idea-${slugify(idea.concept)}`, label: idea.concept, level: 2 })) });
        }
        if(review.frameworks?.length > 0) {
            items.push({ id: 'frameworks', label: 'Frameworks', level: 1, children: review.frameworks.map(fw => ({ id: `framework-${slugify(fw.name)}`, label: fw.name, level: 2 })) });
        }
        if(review.quotes?.length > 0) items.push({ id: 'quotes', label: 'Quotes', level: 1 });
        items.push({ id: 'reflections', label: 'My Reflections', level: 1 });
        items.push({ id: 'who-should-read', label: 'Who Should Read This?', level: 1 });
        items.push({ id: 'verdict', label: 'Rating & Verdict', level: 1 });

        return items;
    }, [review]);
    
    return (
        <nav className="sticky top-24">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">On this page</h3>
            <ul className="space-y-2">
                {tocItems.map(item => (
                    <li key={item.id}>
                        <a href={`#${item.id}`} className="block text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">{item.label}</a>
                        {item.children && (
                            <ul className="pl-4 mt-2 space-y-2">
                                {item.children.map(child => (
                                    <li key={child.id}><a href={`#${child.id}`} className="block text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">{child.label}</a></li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    )
};


export const BookReviewDetailPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const { reviewId } = useParams();
    const navigate = useNavigate();
    const { bookReviews, updateBookReview, deleteBookReview, loading } = useData();
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const review = useMemo(() => bookReviews.find(r => r.id === reviewId), [bookReviews, reviewId]);

    const handleEdit = () => setIsFormOpen(true);

    const handleDelete = () => {
        if (review && window.confirm(`Are you sure you want to delete the review for "${review.title}"?`)) {
            deleteBookReview(review.id);
            navigate('/reviews');
        }
    };
    
    const handleSave = (data: BookReview, id?: string) => {
        if (id) {
            updateBookReview({ ...data, id });
        }
    };

    const handleExportPdf = async () => {
        if (!contentRef.current || !review) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(contentRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff',
            });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${review.title.replace(/ /g, '_')}_Review.pdf`);

        } catch (error) {
            console.error("Failed to export PDF:", error);
            alert("Could not export to PDF. There might be an issue with loading images.");
        } finally {
            setIsExporting(false);
        }
    };

    useEffect(() => {
        if (review) {
            setHeaderActions(
                <div className="flex items-center gap-2">
                    <button onClick={handleExportPdf} disabled={isExporting} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 border dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50">
                        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16}/>}
                        {isExporting ? 'Downloading...' : 'Download PDF'}
                    </button>
                    <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 border dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"><Edit size={16}/> Edit</button>
                    <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 dark:bg-red-900/40 rounded-lg hover:bg-red-200"><Trash2 size={16}/> Delete</button>
                </div>
            );
        }
        return () => setHeaderActions(null);
    }, [setHeaderActions, review, isExporting]);

    if (loading) return <p>Loading review...</p>;
    if (!review) return <p>Review not found.</p>;

    return (
        <div className="max-w-6xl mx-auto">
            <Link to="/reviews" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6">
                <ArrowLeft size={16} /> Back to all reviews
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-12">
                <div ref={contentRef} className="lg:col-span-3">
                     <header className="pb-8 border-b dark:border-slate-700">
                        <div className="flex flex-col md:flex-row gap-8">
                            <img src={review.coverImageUrl} alt={review.title} className="w-40 h-auto rounded-lg shadow-2xl self-center md:self-start flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-sky-600 dark:text-sky-400">{review.category}</p>
                                <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-slate-900 dark:text-white">{review.title}</h1>
                                <p className="text-xl text-slate-500 dark:text-slate-400 mt-1">by {review.author}</p>
                                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mt-6">
                                    <span className="flex items-center gap-1.5"><Clock size={14}/> {review.readingTime} min read</span>
                                    <span className="flex items-center gap-1.5"><BarChart size={14}/> {review.difficulty}</span>
                                </div>
                                <p className="mt-4 italic text-slate-600 dark:text-slate-300">"{review.tagline}"</p>
                            </div>
                        </div>
                    </header>
                    <article>
                         <Section id="tldr" icon={Check} title="TL;DR – Key Takeaways">
                            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                                {review.keyTakeaways.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </Section>
                        <Section id="core-ideas" icon={Lightbulb} title="Core Ideas / Main Concepts">
                            <div className="space-y-8">
                                {review.coreIdeas.map((idea, i) => (
                                    <div key={i} id={`idea-${slugify(idea.concept)}`}>
                                        <h3 className="font-semibold text-xl text-slate-800 dark:text-slate-200">{idea.concept}</h3>
                                        <p className="mt-2 text-slate-600 dark:text-slate-300">{idea.explanation}</p>
                                        <p className="mt-3 text-sm text-sky-700 dark:text-sky-400/80"><b>Why it matters:</b> {idea.relevance}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                        {review.frameworks && review.frameworks.length > 0 && (
                            <Section id="frameworks" icon={BrainCircuit} title="Frameworks & Mental Models">
                                <div className="space-y-6">
                                    {review.frameworks.map((fw, i) => (
                                        <div key={i} id={`framework-${slugify(fw.name)}`} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border dark:border-slate-700">
                                            <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{fw.name}</h4>
                                            <p className="mt-1 text-slate-600 dark:text-slate-300">{fw.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}
                        {review.quotes && review.quotes.length > 0 && (
                            <Section id="quotes" icon={Quote} title="Curated Quotes & Passages">
                                <div className="space-y-8">
                                    {review.quotes.map((q, i) => (
                                        <blockquote key={i} className="border-l-4 border-slate-300 dark:border-slate-600 pl-6 italic">
                                            <p className="text-xl text-slate-800 dark:text-slate-200">"{q.text}"</p>
                                            <footer className="text-sm text-slate-500 dark:text-slate-400 mt-2 not-italic">— {q.context}</footer>
                                        </blockquote>
                                    ))}
                                </div>
                            </Section>
                        )}
                        <Section id="reflections" icon={User} title="My Reflections">
                            <div className="prose dark:prose-invert max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: review.reflections.replace(/\n/g, '<br/>') }} />
                        </Section>
                        <Section id="who-should-read" icon={User} title="Who Should Read This?">
                            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                            {review.whoShouldRead.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </Section>
                        <Section id="verdict" icon={Star} title="Rating & Verdict" className="border-b-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <QualitativeRating label="Insight Depth" score={review.qualitativeRating.insightDepth} />
                                    <QualitativeRating label="Practicality" score={review.qualitativeRating.practicality} />
                                    <QualitativeRating label="Timelessness" score={review.qualitativeRating.timelessness} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200">The Verdict</h4>
                                    <p className="mt-1 text-slate-600 dark:text-slate-300">{review.verdict}</p>
                                </div>
                            </div>
                        </Section>
                    </article>
                </div>

                <aside className="hidden lg:block">
                     <TableOfContents review={review} />
                </aside>
            </div>
             <BookReviewFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                review={review}
                onSave={handleSave}
            />
        </div>
    );
};
