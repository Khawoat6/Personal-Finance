import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Modal } from '../components/ui/Modal';
import type { RiskProfile } from '../types';
import { CheckCircle } from 'lucide-react';

const Label = "block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300";
const RadioGroup: React.FC<{ name: string; options: string[]; selected: string | undefined; onChange: (value: string) => void }> = ({ name, options, selected, onChange }) => (
    <div className="space-y-2">
        {options.map(option => (
            <label key={option} className="flex items-center p-3 rounded-lg border dark:border-slate-700 has-[:checked]:border-slate-500 has-[:checked]:bg-slate-50 dark:has-[:checked]:bg-slate-800 cursor-pointer transition-colors">
                <input
                    type="radio"
                    name={name}
                    value={option}
                    checked={selected === option}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-4 w-4 border-gray-300 text-slate-600 focus:ring-slate-500"
                />
                <span className="ml-3 text-sm font-medium text-slate-800 dark:text-slate-200">{option}</span>
            </label>
        ))}
    </div>
);

export const RiskProfileModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { riskProfile, updateRiskProfile } = useData();
    const [formState, setFormState] = useState<Partial<RiskProfile>>({});
    const [isComplete, setIsComplete] = useState(false);
    const [calculatedProfile, setCalculatedProfile] = useState<RiskProfile['calculatedRiskProfile'] | undefined>(undefined);
    
    useEffect(() => {
        if (isOpen) {
            setFormState(riskProfile);
            setIsComplete(false);
            setCalculatedProfile(undefined);
        }
    }, [isOpen, riskProfile]);

    const handleChange = (name: keyof RiskProfile, value: string) => {
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleComplete = async () => {
        // Simple scoring
        const scoreMap: { [key: string]: number } = {
            'Capital Preservation': 1, 'Income': 2, 'Growth': 3, 'Aggressive Growth': 4,
            'Conservative': 1, 'Moderately Conservative': 2, 'Moderate': 3, 'Moderately Aggressive': 4, 'Aggressive': 5,
            'Short-term (< 3 years)': 1, 'Medium-term (3-7 years)': 2, 'Long-term (7-15 years)': 4, 'Very long-term (> 15 years)': 5,
            'Within 1 year': 1, '1-3 years': 2, '3-5 years': 3, '> 5 years': 4
        };
        const totalScore = (scoreMap[formState.objective || ''] || 0) + (scoreMap[formState.riskTolerance || ''] || 0) + (scoreMap[formState.timeHorizon || ''] || 0);

        let finalProfile: RiskProfile['calculatedRiskProfile'] = 'Conservative';
        if (totalScore > 12) finalProfile = 'Aggressive';
        else if (totalScore > 10) finalProfile = 'Moderately Aggressive';
        else if (totalScore > 7) finalProfile = 'Moderate';
        else if (totalScore > 4) finalProfile = 'Moderately Conservative';

        const finalRiskProfile = { ...formState, calculatedRiskProfile: finalProfile };
        await updateRiskProfile(finalRiskProfile);
        setCalculatedProfile(finalProfile);
        setIsComplete(true);
    };

    const isFormValid = formState.objective && formState.riskTolerance && formState.timeHorizon && formState.liquidityNeeds;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isComplete ? "Profile Updated" : "Let’s fill out your risk profile"} maxWidth="max-w-xl">
            {!isComplete ? (
                <>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        We’ll gather basic information on your goals, time horizon, and risk tolerance to personalize your experience.
                    </p>
                    <div className="space-y-6">
                        <div>
                            <p className={Label}>What is your primary investment objective?</p>
                            <RadioGroup name="objective" selected={formState.objective} onChange={(v) => handleChange('objective', v)} options={['Capital Preservation', 'Income', 'Growth', 'Aggressive Growth']} />
                        </div>
                        <div>
                            <p className={Label}>Which type of investment risk are you most comfortable with?</p>
                            <RadioGroup name="riskTolerance" selected={formState.riskTolerance} onChange={(v) => handleChange('riskTolerance', v)} options={['Conservative', 'Moderately Conservative', 'Moderate', 'Moderately Aggressive', 'Aggressive']} />
                        </div>
                        <div>
                            <p className={Label}>What is your current time horizon when thinking about investing?</p>
                            <RadioGroup name="timeHorizon" selected={formState.timeHorizon} onChange={(v) => handleChange('timeHorizon', v)} options={['Short-term (< 3 years)', 'Medium-term (3-7 years)', 'Long-term (7-15 years)', 'Very long-term (> 15 years)']} />
                        </div>
                        <div>
                            <p className={Label}>How soon will you need access to larger sums of liquid assets like cash?</p>
                            <RadioGroup name="liquidityNeeds" selected={formState.liquidityNeeds} onChange={(v) => handleChange('liquidityNeeds', v)} options={['Within 1 year', '1-3 years', '3-5 years', '> 5 years']} />
                        </div>
                    </div>
                    <div className="pt-6 mt-4 flex justify-end">
                        <button onClick={handleComplete} disabled={!isFormValid} className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            Complete
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center py-8">
                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">You’ve completed the risk questionnaire.</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Your risk profile will be set to:</p>
                    <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-2">{calculatedProfile}</p>
                    <div className="mt-8">
                         <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300">
                            Done
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};