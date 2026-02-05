import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { ArrowUp, ArrowDown, ChevronsUpDown, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Data transcribed from the image, with domain added for logos
const initialSoftwareStocks = [
    { ticker: 'FIG', company: 'Figma', domain: 'figma.com', price: 27.19, marketCap: 13.5, ps: 13.91, pe: 'n/a', ytd: -28.62, pct1y: -76.46, a52wHigh: -80.98, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'TTD', company: 'Trade Desk', domain: 'thetradedesk.com', price: 31.39, marketCap: 15.2, ps: 5.44, pe: 35.81, ytd: -17.83, pct1y: -74.39, a52wHigh: -75.05, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'DUOL', company: 'Duolingo', domain: 'duolingo.com', price: 141.09, marketCap: 6.5, ps: 6.76, pe: 17.89, ytd: -20.17, pct1y: -60.64, a52wHigh: -74.11, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'HUBS', company: 'HubSpot', domain: 'hubspot.com', price: 278.59, marketCap: 14.6, ps: 4.88, pe: 'n/a', ytd: -30.63, pct1y: -64.18, a52wHigh: -68.38, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'MNDY', company: 'monday.com', domain: 'monday.com', price: 116.40, marketCap: 6.0, ps: 5.15, pe: 94.90, ytd: -21.58, pct1y: -53.44, a52wHigh: -66.03, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'WIX', company: 'WIX', domain: 'wix.com', price: 89.09, marketCap: 4.9, ps: 2.53, pe: 39.50, ytd: -14.75, pct1y: -63.21, a52wHigh: -63.90, rank1m: 'up', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'TEAM', company: 'Atlassian', domain: 'atlassian.com', price: 119.42, marketCap: 31.4, ps: 5.75, pe: 'n/a', ytd: -26.35, pct1y: -55.99, a52wHigh: -63.37, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'ASAN', company: 'Asana', domain: 'asana.com', price: 10.46, marketCap: 2.5, ps: 3.20, pe: 'n/a', ytd: -24.04, pct1y: -51.88, a52wHigh: -57.31, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'CVLT', company: 'Commvault', domain: 'commvault.com', price: 87.42, marketCap: 3.9, ps: 3.36, pe: 45.32, ytd: -30.96, pct1y: -40.46, a52wHigh: -56.44, rank1m: 'up', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'DOCS', company: 'Doximity', domain: 'doximity.com', price: 38.28, marketCap: 7.2, ps: 11.63, pe: 30.60, ytd: -14.15, pct1y: -33.62, a52wHigh: -55.08, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'KVYO', company: 'Klaviyo', domain: 'klaviyo.com', price: 22.53, marketCap: 6.8, ps: 5.90, pe: 'n/a', ytd: -30.72, pct1y: -50.80, a52wHigh: -54.53, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'BRZE', company: 'Braze', domain: 'braze.com', price: 21.74, marketCap: 2.4, ps: 3.52, pe: 'n/a', ytd: -36.69, pct1y: -52.70, a52wHigh: -54.33, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'IOT', company: 'Samsara', domain: 'samsara.com', price: 28.37, marketCap: 16.4, ps: 10.76, pe: 'n/a', ytd: -20.97, pct1y: -44.34, a52wHigh: -54.17, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'GTLB', company: 'GitLab', domain: 'gitlab.com', price: 34.46, marketCap: 5.8, ps: 6.41, pe: 'n/a', ytd: -9.27, pct1y: -51.00, a52wHigh: -53.55, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'NOW', company: 'ServiceNow', domain: 'servicenow.com', price: 114.08, marketCap: 119.3, ps: 8.99, pe: 69.05, ytd: -25.49, pct1y: -50.12, a52wHigh: -51.26, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'DOCU', company: 'DocuSign', domain: 'docusign.com', price: 52.71, marketCap: 10.5, ps: 3.34, pe: 36.78, ytd: -23.17, pct1y: -44.78, a52wHigh: -46.92, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'GWRE', company: 'Guidewire', domain: 'guidewire.com', price: 147.79, marketCap: 12.6, ps: 9.88, pe: 140.53, ytd: -26.29, pct1y: -28.72, a52wHigh: -45.79, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'ESTC', company: 'Elastic', domain: 'elastic.co', price: 67.66, marketCap: 7.1, ps: 4.43, pe: 'n/a', ytd: -10.42, pct1y: -40.28, a52wHigh: -43.07, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'CLBT', company: 'Cellebrite', domain: 'cellebrite.com', price: 15.26, marketCap: 3.7, ps: 8.18, pe: 48.97, ytd: -15.41, pct1y: -36.31, a52wHigh: -41.98, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'CRM', company: 'Salesforce', domain: 'salesforce.com', price: 211.76, marketCap: 198.3, ps: 4.92, pe: 28.23, ytd: -20.01, pct1y: -40.18, a52wHigh: -39.41, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'WDAY', company: 'Workday', domain: 'workday.com', price: 172.14, marketCap: 45.3, ps: 4.90, pe: 60.97, ytd: -20.01, pct1y: -35.14, a52wHigh: -39.32, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'INTU', company: 'Intuit', domain: 'intuit.com', price: 496.02, marketCap: 138.0, ps: 7.10, pe: 33.98, ytd: -24.91, pct1y: -16.35, a52wHigh: -39.02, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'ADBE', company: 'Adobe', domain: 'adobe.com', price: 289.38, marketCap: 118.8, ps: 5.00, pe: 17.33, ytd: -17.48, pct1y: -34.48, a52wHigh: -37.86, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'SAP', company: 'SAP', domain: 'sap.com', price: 199.05, marketCap: 242.8, ps: 6.65, pe: 27.67, ytd: -17.92, pct1y: -28.10, a52wHigh: -36.46, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'DDOG', company: 'Datadog', domain: 'datadoghq.com', price: 128.65, marketCap: 45.1, ps: 14.03, pe: 377.68, ytd: -6.27, pct1y: -11.71, a52wHigh: -36.21, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'VEEV', company: 'Veeva', domain: 'veeva.com', price: 206.31, marketCap: 33.9, ps: 11.01, pe: 40.13, ytd: -7.65, pct1y: -11.19, a52wHigh: -33.56, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'SNOW', company: 'Snowflake', domain: 'snowflake.com', price: 199.44, marketCap: 68.2, ps: 15.56, pe: 'n/a', ytd: -9.35, pct1y: 9.06, a52wHigh: -28.94, rank1m: 'down', s20ma: 'down', s50ma: 'up', s200ma: 'up' },
    { ticker: 'ZETA', company: 'Zeta', domain: 'zetaglobal.com', price: 19.37, marketCap: 4.8, ps: 3.89, pe: 'n/a', ytd: -5.97, pct1y: 7.55, a52wHigh: -27.18, rank1m: 'down', s20ma: 'down', s50ma: 'up', s200ma: 'up' },
    { ticker: 'ADP', company: 'ADP', domain: 'adp.com', price: 245.89, marketCap: 99.4, ps: 4.69, pe: 23.61, ytd: -4.33, pct1y: -18.19, a52wHigh: -25.45, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'FSLY', company: 'Fastly', domain: 'fastly.com', price: 9.44, marketCap: 1.4, ps: 2.38, pe: 'n/a', ytd: -8.62, pct1y: -11.19, a52wHigh: -25.02, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'ADSK', company: 'Autodesk', domain: 'autodesk.com', price: 254.47, marketCap: 53.9, ps: 7.84, pe: 49.39, ytd: -14.03, pct1y: -16.34, a52wHigh: -22.67, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'CFLT', company: 'Confluent', domain: 'confluent.io', price: 30.54, marketCap: 10.9, ps: 9.78, pe: 'n/a', ytd: 0.89, pct1y: 1.46, a52wHigh: -19.42, rank1m: 'down', s20ma: 'up', s50ma: 'up', s200ma: 'up' },
    { ticker: 'TWLO', company: 'Twilio', domain: 'twilio.com', price: 122.71, marketCap: 18.6, ps: 3.80, pe: 294.37, ytd: -14.10, pct1y: -16.01, a52wHigh: -19.24, rank1m: 'down', s20ma: 'down', s50ma: 'down', s200ma: 'down' },
    { ticker: 'MDB', company: 'MongoDB', domain: 'mongodb.com', price: 371.67, marketCap: 30.3, ps: 13.06, pe: 'n/a', ytd: -12.03, pct1y: 33.54, a52wHigh: -16.43, rank1m: 'down', s20ma: 'up', s50ma: 'up', s200ma: 'up' },
    { ticker: 'ZM', company: 'Zoom', domain: 'zoom.us', price: 91.09, marketCap: 27.0, ps: 5.61, pe: 17.71, ytd: 5.57, pct1y: 4.46, a52wHigh: -6.65, rank1m: 'up', s20ma: 'up', s50ma: 'up', s200ma: 'up' },
];

type StockData = typeof initialSoftwareStocks[0];
type SortableKeys = keyof StockData;

const renderTrendIcon = (trend: 'up' | 'down') => {
    const className = trend === 'up' ? 'text-green-500' : 'text-red-500';
    const Icon = trend === 'up' ? ArrowUp : ArrowDown;
    return <Icon size={16} className={className} />;
};

const formatPercentage = (value: number) => {
    const color = value > 0 ? 'text-green-600 dark:text-green-400' : value < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400';
    const bgColor = value > 0 ? 'bg-green-100/60 dark:bg-green-900/40' : value < 0 ? 'bg-red-100/60 dark:bg-red-900/40' : 'bg-slate-100 dark:bg-slate-700/50';
    return <div className={`px-2 py-1 rounded-md text-right ${bgColor} ${color}`}>{value.toFixed(2)}%</div>;
};

export const SoftwareMeltdownPage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const [stocks, setStocks] = useState<StockData[]>(initialSoftwareStocks);
    const [priceChanges, setPriceChanges] = useState<Record<string, 'up' | 'down'>>({});
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' } | null>({ key: 'pct1y', direction: 'asc' });

    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [analyzingStock, setAnalyzingStock] = useState<StockData | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    useEffect(() => {
        setHeaderActions(null);
        return () => setHeaderActions(null);
    }, [setHeaderActions]);

    // Real-time data simulation
    useEffect(() => {
        const interval = setInterval(() => {
            const newChanges: Record<string, 'up' | 'down'> = {};
            setStocks(currentStocks => 
                currentStocks.map(stock => {
                    const changePercent = (Math.random() - 0.49) * 0.005; // Small random fluctuation
                    const newPrice = stock.price * (1 + changePercent);
                    if (newPrice > stock.price) {
                        newChanges[stock.ticker] = 'up';
                    } else if (newPrice < stock.price) {
                        newChanges[stock.ticker] = 'down';
                    }
                    return { ...stock, price: newPrice };
                })
            );
            setPriceChanges(newChanges);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleAnalysis = async (stock: StockData) => {
        setAnalyzingStock(stock);
        setIsAnalysisModalOpen(true);
        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Provide a real-time, brief market analysis and recent news summary for ${stock.company} (${stock.ticker}). Focus on factors affecting its stock price today.`;
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { tools: [{ googleSearch: {} }] },
            });
            setAnalysisResult(response.text ?? 'No analysis available.');
        } catch (error) {
            console.error("Gemini analysis error:", error);
            setAnalysisResult('Could not fetch real-time analysis. Please check your API key and network connection.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const sortedStocks = useMemo(() => {
        let sortableItems = [...stocks];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                
                if (valA === 'n/a') return 1;
                if (valB === 'n/a') return -1;

                if (typeof valA === 'string' && typeof valB === 'string') {
                    if (valA.toLowerCase() < valB.toLowerCase()) return sortConfig.direction === 'asc' ? -1 : 1;
                    if (valA.toLowerCase() > valB.toLowerCase()) return sortConfig.direction === 'asc' ? 1 : -1;
                    return 0;
                }
                
                if(typeof valA === 'number' && typeof valB === 'number') {
                    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                }
                
                return 0;
            });
        }
        return sortableItems;
    }, [stocks, sortConfig]);
    
     const requestSort = (key: SortableKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader: React.FC<{ columnKey: SortableKeys, label: string, className?: string }> = ({ columnKey, label, className }) => {
        const isSorted = sortConfig?.key === columnKey;
        return (
            <th scope="col" className={`py-3.5 px-3 text-left text-sm font-semibold cursor-pointer ${className}`} onClick={() => requestSort(columnKey)}>
                <div className="group inline-flex items-center gap-1">
                    {label}
                    <span className={`transition-opacity ${isSorted ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'}`}>
                        {isSorted ? (sortConfig?.direction === 'asc' ? '▲' : '▼') : <ChevronsUpDown size={14} />}
                    </span>
                </div>
            </th>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Software Meltdown</h1>
            <Card className="overflow-x-auto p-0">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                            <th scope="col" className="py-3.5 px-3 text-center text-sm font-semibold">AI</th>
                            <SortableHeader columnKey="company" label="Company" className="pl-4 sm:pl-6"/>
                            <SortableHeader columnKey="price" label="Price" />
                            <SortableHeader columnKey="marketCap" label="Market Cap" />
                            <SortableHeader columnKey="ps" label="P/S" />
                            <SortableHeader columnKey="pe" label="P/E" />
                            <SortableHeader columnKey="ytd" label="% YTD" />
                            <SortableHeader columnKey="pct1y" label="% 1Y" />
                            <SortableHeader columnKey="a52wHigh" label="∆ 52W High" />
                            <th scope="col" className="py-3.5 px-3 text-center text-sm font-semibold">1M</th>
                            <th scope="col" className="py-3.5 px-3 text-center text-sm font-semibold">20SMA</th>
                            <th scope="col" className="py-3.5 px-3 text-center text-sm font-semibold">50SMA</th>
                            <th scope="col" className="py-3.5 px-3 text-center text-sm font-semibold pr-4 sm:pr-6">200SMA</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800/50">
                        {sortedStocks.map((stock) => (
                            <tr key={stock.ticker} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="whitespace-nowrap py-3 px-3 text-center">
                                    <button onClick={() => handleAnalysis(stock)} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                                        <Sparkles size={16} />
                                    </button>
                                </td>
                                <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm sm:pl-6">
                                    <div className="flex items-center">
                                        <div className="h-9 w-9 flex-shrink-0">
                                             <img
                                                className="h-9 w-9 rounded-full object-contain bg-white"
                                                src={`https://logo.clearbit.com/${stock.domain}`}
                                                alt={`${stock.company} logo`}
                                                onError={(e) => { (e.currentTarget.style.display = 'none'); (e.currentTarget.nextSibling as HTMLElement)?.classList.remove('hidden'); }}
                                            />
                                            <div className="hidden h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
                                                {stock.company.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium text-slate-900 dark:text-white">{stock.ticker}</div>
                                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stock.company}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className={`whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300 text-right ${priceChanges[stock.ticker] === 'up' ? 'flash-green' : priceChanges[stock.ticker] === 'down' ? 'flash-red' : ''}`}>${stock.price.toFixed(2)}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300 text-right">{stock.marketCap.toFixed(1)}B</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300 text-right">{stock.ps.toFixed(2)}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-300 text-right">{typeof stock.pe === 'number' ? stock.pe.toFixed(2) : stock.pe}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">{formatPercentage(stock.ytd)}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">{formatPercentage(stock.pct1y)}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">{formatPercentage(stock.a52wHigh)}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm"><div className="flex justify-center">{renderTrendIcon(stock.rank1m as 'up' | 'down')}</div></td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm"><div className="flex justify-center">{renderTrendIcon(stock.s20ma as 'up' | 'down')}</div></td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm"><div className="flex justify-center">{renderTrendIcon(stock.s50ma as 'up' | 'down')}</div></td>
                                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-sm sm:pr-6"><div className="flex justify-center">{renderTrendIcon(stock.s200ma as 'up' | 'down')}</div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal isOpen={isAnalysisModalOpen} onClose={() => setIsAnalysisModalOpen(false)} title={`Real-Time Analysis: ${analyzingStock?.company || ''}`}>
                {isAnalyzing ? (
                    <div className="text-center p-8 space-y-3">
                        <Sparkles size={32} className="mx-auto text-sky-500 animate-pulse" />
                        <p className="text-slate-500">Fetching live market data with Gemini...</p>
                    </div>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                       {analysisResult}
                    </div>
                )}
            </Modal>
        </div>
    );
};