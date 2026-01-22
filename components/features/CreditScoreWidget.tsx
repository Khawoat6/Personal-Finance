import React, { useState, useRef, useEffect } from 'react';
import { Clock, Pencil } from 'lucide-react';

export const CreditScoreWidget: React.FC = () => {
    const [score, setScore] = useState(691);
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(String(score));
    const inputRef = useRef<HTMLInputElement>(null);

    const maxScore = 900;
    const minScore = 300;
    const totalBars = 32;

    const getScoreLevel = (s: number) => {
        if (s >= 753) return 'AA';
        if (s >= 725) return 'BB';
        if (s >= 699) return 'CC';
        if (s >= 681) return 'DD';
        if (s >= 666) return 'EE';
        if (s >= 646) return 'FF';
        if (s >= 616) return 'GG';
        if (s >= 300) return 'HH';
        return 'N/A';
    };

    const scoreLevel = getScoreLevel(score);
    const filledBars = Math.round(((score - minScore) / (maxScore - minScore)) * totalBars);
    const lastUpdatedDate = "Dec 27, 2025, 18:53";

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        const newScore = parseInt(inputValue, 10);
        if (!isNaN(newScore) && newScore >= minScore && newScore <= maxScore) {
            setScore(newScore);
        } else {
            setInputValue(String(score)); // Reset if invalid
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSave();
        else if (e.key === 'Escape') {
            setInputValue(String(score));
            setIsEditing(false);
        }
    };

    const handleEditClick = () => {
        if (isEditing) return;
        setInputValue(String(score));
        setIsEditing(true);
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-zinc-200 dark:border-slate-700 p-4 mb-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-zinc-500 dark:text-slate-400" />
                    <h4 className="font-semibold text-zinc-800 dark:text-slate-200">Credit Score</h4>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-zinc-500 dark:text-slate-400 flex items-baseline">
                    Your credit score is
                    <span className="text-3xl font-bold text-zinc-900 dark:text-slate-100 ml-2 w-24 text-left group relative" onClick={handleEditClick}>
                        {isEditing ? (
                             <input
                                ref={inputRef}
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onBlur={handleSave}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-slate-100 dark:bg-slate-700 font-bold text-zinc-900 dark:text-slate-100 rounded-md p-0 focus:outline-none focus:ring-2 ring-teal-500 text-center"
                            />
                        ) : (
                            <>
                                <span className="cursor-pointer">{score}</span>
                                <Pencil size={14} className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 cursor-pointer"/>
                            </>
                        )}
                    </span>
                </p>
                <p className="text-sm text-zinc-500 dark:text-slate-400 mt-1">
                    This score is considered to be <span className="font-semibold text-zinc-700 dark:text-slate-300">{scoreLevel}</span>.
                </p>
            </div>
            
            <div className="flex gap-1 mt-4">
                {Array.from({ length: totalBars }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 flex-1 rounded-sm transition-colors duration-300 ${i < filledBars ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                    />
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-slate-700 text-xs text-zinc-500 dark:text-slate-400 space-y-1">
                <div className="flex justify-between">
                    <span>Repayment Probability:</span>
                    <span className="font-semibold text-zinc-700 dark:text-slate-300">93%</span>
                </div>
                <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-semibold text-zinc-700 dark:text-slate-300">{lastUpdatedDate}</span>
                </div>
            </div>
        </div>
    );
};