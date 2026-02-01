import React, { useState, useMemo } from 'react';
import { toolCategories } from '../data/toolsData';
import { Card } from '../components/ui/Card';
import { Search, Globe } from 'lucide-react';

const getFaviconUrl = (url: string) => {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
    } catch (e) {
        return '';
    }
};

export const ToolsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) {
            return toolCategories;
        }
        const lowercasedTerm = searchTerm.toLowerCase();

        return toolCategories
            .map(category => {
                const filteredLinks = category.links.filter(link =>
                    link.name.toLowerCase().includes(lowercasedTerm)
                );

                if (filteredLinks.length > 0) {
                    return { ...category, links: filteredLinks };
                }
                
                if (category.title.toLowerCase().includes(lowercasedTerm)) {
                    return category;
                }
                
                return null;
            })
            .filter((category): category is typeof toolCategories[0] => category !== null);
    }, [searchTerm]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Tools</h1>

            <div className="relative">
                <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search all tools and categories..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filteredData.map(category => (
                    <Card key={category.title} className="p-4 flex flex-col bg-slate-800/50 border-slate-700">
                        <h3 className="font-semibold mb-3 text-slate-200">{category.title}</h3>
                        <div className="space-y-1 flex-grow">
                            {category.links.map(link => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-1.5 rounded-md hover:bg-slate-700/50 transition-colors group"
                                >
                                    <img
                                        src={getFaviconUrl(link.url)}
                                        alt=""
                                        className="w-4 h-4 object-contain flex-shrink-0"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }}
                                    />
                                    <Globe size={16} className="text-slate-500 hidden flex-shrink-0" />
                                    <span className="text-sm text-slate-300 group-hover:text-white truncate">{link.name}</span>
                                </a>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
            {filteredData.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                    <p>No tools found for "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
};