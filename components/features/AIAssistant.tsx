
import React, { useState, useMemo } from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { GoogleGenAI } from '@google/genai';
import { Modal } from '../ui/Modal';
import { formatCurrency } from '../../utils/formatters';

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n');
    return (
        <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-700 dark:text-slate-300">
            {lines.map((line, index) => {
                if (line.startsWith('* ')) {
                    return <li key={index} className="ml-4">{line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>;
                }
                if (line.trim() === '') {
                    return <br key={index} />;
                }
                const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                return <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
            })}
        </div>
    );
};


export const AIAssistant: React.FC = () => {
    const { transactions, categories } = useData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [aiSummaryContent, setAiSummaryContent] = useState('');
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

    const summary = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const currentMonthTransactions = transactions.filter(
            t => new Date(t.date) >= startOfMonth
        );

        const totalIncome = currentMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const savingRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
        
        const expenseByCategory = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                const category = categories.find(c => c.id === t.categoryId);
                if (category) {
                     const topLevelCategory = categories.find(c => c.id === category.parentCategoryId) || category;
                     acc[topLevelCategory.name] = (acc[topLevelCategory.name] || 0) + t.amount;
                }
                return acc;
            }, {} as { [key: string]: number });

        return { totalIncome, totalExpense, savingRate, expenseByCategory };
    }, [transactions, categories]);

    const handleGenerateSummary = async () => {
        setModalOpen(true);
        setIsGeneratingSummary(true);
        setAiSummaryContent('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const topExpenses = Object.entries(summary.expenseByCategory)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([name, amount]) => `- ${name.split('–')[1]?.trim() ?? name}: ${formatCurrency(amount)}`)
                .join('\n');
            
            const prompt = `You are a friendly and encouraging financial assistant. Based on the following financial data for this month in Thai Baht, provide a concise summary (around 100-150 words) of the user's financial health. Highlight one positive achievement and suggest one potential area for improvement in a constructive way. Format your response using markdown-style bolding for key terms and use bullet points for the achievement and suggestion.\n\nData:\n- Total Income: ${formatCurrency(summary.totalIncome)}\n- Total Expense: ${formatCurrency(summary.totalExpense)}\n- Saving Rate: ${summary.savingRate.toFixed(2)}%\n- Top Expense Categories:\n${topExpenses}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });
            setAiSummaryContent(response.text ?? 'Sorry, I could not generate a summary.');
        } catch (error) {
            console.error("AI summary generation failed:", error);
            setAiSummaryContent('An error occurred while generating your summary. Please check your API key and try again.');
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    return (
        <>
            <button
                onClick={handleGenerateSummary}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 dark:shadow-purple-900/50"
            >
                <Sparkles size={16} />
                <span>Ask anything</span>
            </button>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title="AI Financial Assistant"
                maxWidth="max-w-xl"
            >
                {isGeneratingSummary ? (
                    <div className="text-center p-8">
                        <Sparkles className="h-8 w-8 text-purple-500 animate-pulse mx-auto" />
                        <p className="mt-4 text-zinc-500 dark:text-slate-400">Your personal AI assistant is analyzing your financial data...</p>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <BrainCircuit className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                         <SimpleMarkdown text={aiSummaryContent} />
                    </div>
                )}
            </Modal>
        </>
    );
};
