import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/ui/Card';
import { GoogleGenAI, Type } from "@google/genai";
import { RefreshCw, TrendingUp, TrendingDown, Clock } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface IndexData { name: string; price: string; change: string; percentChange: string; }
interface MoverData { ticker: string; price: string; percentChange: string; }
interface CryptoData { price: string; change24h: string; summary: string; }
interface EventData { eventName: string; date: string; }

// --- UI COMPONENTS ---
const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = 'h-4' }) => (
    <div className={`bg-slate-200 dark:bg-slate-700 rounded animate-pulse ${className}`} />
);

const MoverCard: React.FC<{ title: string; data: MoverData[] | null; isLoading: boolean; icon: React.ElementType }> = ({ title, data, isLoading, icon: Icon }) => (
    <Card>
        <h3 className="font-semibold flex items-center gap-2"><Icon size={16} /> {title}</h3>
        <div className="space-y-2 mt-3 text-sm">
            {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center"><LoadingSkeleton className="h-5 w-1/4" /><LoadingSkeleton className="h-5 w-1/3" /></div>
                ))
            ) : data && data.length > 0 ? (
                data.map(mover => (
                    <div key={mover.ticker} className="flex justify-between items-center">
                        <span className="font-bold">{mover.ticker}</span>
                        <div className="text-right">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{mover.price}</span>
                            <span className={`ml-2 font-semibold ${title === 'Top Gainers' ? 'text-green-500' : 'text-red-500'}`}>{mover.percentChange}</span>
                        </div>
                    </div>
                ))
            ) : <p className="text-slate-500 text-xs">No data available.</p>}
        </div>
    </Card>
);

// --- MAIN PAGE COMPONENT ---
export const MarketPulsePage: React.FC<{ setHeaderActions: (actions: React.ReactNode) => void }> = ({ setHeaderActions }) => {
    const [marketSummary, setMarketSummary] = useState<string | null>(null);
    const [indices, setIndices] = useState<IndexData[] | null>(null);
    const [topMovers, setTopMovers] = useState<{ gainers: MoverData[]; losers: MoverData[] } | null>(null);
    const [marketSentiment, setMarketSentiment] = useState<string | null>(null);
    const [cryptoData, setCryptoData] = useState<{ BTC: CryptoData; ETH: CryptoData } | null>(null);
    const [economicEvents, setEconomicEvents] = useState<EventData[] | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [loadingStates, setLoadingStates] = useState({ summary: true, indices: true, movers: true, sentiment: true, crypto: true, events: true });
    
    const fetchMarketData = useCallback(async () => {
        setLoadingStates({ summary: true, indices: true, movers: true, sentiment: true, crypto: true, events: true });
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        // --- All Gemini API Calls ---
        const fetchSummary = ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: "Provide a concise, one-paragraph summary of today's US stock market performance, including the general trend and any major influencing factors.", config: { tools: [{ googleSearch: {} }] } });
        const fetchSentiment = ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: "Based on today's top financial news headlines, what is the overall market sentiment? Respond with a single word (e.g., Bullish, Bearish, Neutral, Fearful, Greedy) followed by a one-sentence explanation.", config: { tools: [{ googleSearch: {} }] } });
        
        const fetchIndices = ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: "Fetch the current price, change, and percentage change for the S&P 500, Nasdaq Composite, and Dow Jones Industrial Average.", config: { tools: [{ googleSearch: {} }], responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { indices: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, price: { type: Type.STRING }, change: { type: Type.STRING }, percentChange: { type: Type.STRING } } } } } } } });
        const fetchMovers = ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: "List the top 3 gaining and top 3 losing stocks on the US market today, including their ticker, price, and percentage change.", config: { tools: [{ googleSearch: {} }], responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { gainers: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { ticker: { type: Type.STRING }, price: { type: Type.STRING }, percentChange: { type: Type.STRING } } } }, losers: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { ticker: { type: Type.STRING }, price: { type: Type.STRING }, percentChange: { type: Type.STRING } } } } } } } });
        const fetchCrypto = ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: "Provide the current price, 24h percentage change, and a one-sentence market summary for Bitcoin (BTC) and Ethereum (ETH).", config: { tools: [{ googleSearch: {} }], responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { BTC: { type: Type.OBJECT, properties: { price: { type: Type.STRING }, change24h: { type: Type.STRING }, summary: { type: Type.STRING } } }, ETH: { type: Type.OBJECT, properties: { price: { type: Type.STRING }, change24h: { type: Type.STRING }, summary: { type: Type.STRING } } } } } } });
        const fetchEvents = ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: "List the top 3 most important US economic events scheduled for this week, including the event name and date.", config: { tools: [{ googleSearch: {} }], responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { events: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { eventName: { type: Type.STRING }, date: { type: Type.STRING } } } } } } } });

        // --- Process Responses ---
        fetchSummary.then(res => setMarketSummary(res.text ?? "Could not load summary.")).finally(() => setLoadingStates(p => ({ ...p, summary: false })));
        fetchSentiment.then(res => setMarketSentiment(res.text ?? "Could not load sentiment.")).finally(() => setLoadingStates(p => ({ ...p, sentiment: false })));
        fetchIndices.then(res => setIndices(JSON.parse(res.text ?? '{}').indices)).catch(console.error).finally(() => setLoadingStates(p => ({ ...p, indices: false })));
        fetchMovers.then(res => setTopMovers(JSON.parse(res.text ?? '{}'))).catch(console.error).finally(() => setLoadingStates(p => ({ ...p, movers: false })));
        fetchCrypto.then(res => setCryptoData(JSON.parse(res.text ?? '{}'))).catch(console.error).finally(() => setLoadingStates(p => ({ ...p, crypto: false })));
        fetchEvents.then(res => setEconomicEvents(JSON.parse(res.text ?? '{}').events)).catch(console.error).finally(() => setLoadingStates(p => ({ ...p, events: false })));
        
        setLastUpdated(new Date());
    }, []);

    useEffect(() => {
        fetchMarketData();
        setHeaderActions(
            <button
                onClick={fetchMarketData}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300"
            >
                <RefreshCw size={14} className={Object.values(loadingStates).some(Boolean) ? 'animate-spin' : ''} />
                <span>Refresh</span>
            </button>
        );
        return () => setHeaderActions(null);
    }, [setHeaderActions, fetchMarketData]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Market Pulse</h1>
                {lastUpdated && <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Clock size={12}/> Last updated: {lastUpdated.toLocaleTimeString()}</p>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-3">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Daily Market Summary</h3>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {loadingStates.summary ? <div className="space-y-2 mt-3"><LoadingSkeleton /><LoadingSkeleton className="w-5/6" /></div> : <p>{marketSummary}</p>}
                    </div>
                </Card>

                <Card className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x dark:divide-slate-700">
                        {loadingStates.indices ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="p-4 space-y-2"><LoadingSkeleton className="w-1/2 h-5" /><LoadingSkeleton className="w-3/4 h-8" /><LoadingSkeleton className="w-1/4 h-4" /></div>)
                        : indices && indices.length > 0 ? indices.map(index => {
                            const isPositive = !index.change.startsWith('-');
                            return(
                                <div key={index.name} className="p-4">
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{index.name}</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{index.price}</p>
                                    <p className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{index.change} ({index.percentChange})</p>
                                </div>
                            );
                        }) : <p className="p-4 text-sm text-slate-500">Could not load index data.</p>}
                    </div>
                </Card>

                <MoverCard title="Top Gainers" data={topMovers?.gainers ?? null} isLoading={loadingStates.movers} icon={TrendingUp} />
                <MoverCard title="Top Losers" data={topMovers?.losers ?? null} isLoading={loadingStates.movers} icon={TrendingDown} />
                
                <Card>
                    <h3 className="font-semibold">Market Sentiment</h3>
                    <div className="mt-3">
                        {loadingStates.sentiment ? <LoadingSkeleton className="h-16" /> : (
                            <p className="text-sm text-slate-600 dark:text-slate-300">{marketSentiment}</p>
                        )}
                    </div>
                </Card>

                <Card className="lg:col-span-2">
                    <h3 className="font-semibold">Crypto Snapshot</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        {loadingStates.crypto ? Array.from({ length: 2 }).map((_, i) => <div key={i} className="space-y-2"><LoadingSkeleton className="w-1/4 h-5" /><LoadingSkeleton className="w-1/2 h-6" /><LoadingSkeleton className="w-full h-8" /></div>)
                        : cryptoData ? (
                            <>
                                <div>
                                    <p className="font-bold text-lg">Bitcoin (BTC)</p>
                                    <p className="text-xl font-mono text-slate-800 dark:text-slate-200">{cryptoData.BTC.price}</p>
                                    <p className={`text-sm font-semibold ${!cryptoData.BTC.change24h.startsWith('-') ? 'text-green-500' : 'text-red-500'}`}>{cryptoData.BTC.change24h} (24h)</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cryptoData.BTC.summary}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-lg">Ethereum (ETH)</p>
                                    <p className="text-xl font-mono text-slate-800 dark:text-slate-200">{cryptoData.ETH.price}</p>
                                    <p className={`text-sm font-semibold ${!cryptoData.ETH.change24h.startsWith('-') ? 'text-green-500' : 'text-red-500'}`}>{cryptoData.ETH.change24h} (24h)</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cryptoData.ETH.summary}</p>
                                </div>
                            </>
                        ) : <p className="text-sm text-slate-500">Could not load crypto data.</p>}
                    </div>
                </Card>

                <Card>
                    <h3 className="font-semibold">This Week's Economic Calendar</h3>
                    <div className="space-y-2 mt-3 text-sm">
                        {loadingStates.events ? Array.from({ length: 3 }).map((_, i) => <LoadingSkeleton key={i} className="h-10" />)
                        : economicEvents && economicEvents.length > 0 ? (
                            economicEvents.map(event => (
                                <div key={event.eventName} className="p-2 rounded-md bg-slate-100 dark:bg-slate-700/50">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{event.eventName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{event.date}</p>
                                </div>
                            ))
                        ) : <p className="text-slate-500 text-xs">No key events found for this week.</p>}
                    </div>
                </Card>

            </div>
        </div>
    );
};
