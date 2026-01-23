import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { Save } from 'lucide-react';
import type { Profile } from '../types';
import { RiskProfileModal } from './RiskProfileModal';

const Input = "w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-colors";
const Select = `${Input} appearance-none`;
const Label = "block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300";
const Textarea = `${Input} min-h-[80px]`;

export const ProfilePage: React.FC = () => {
    const { profile, riskProfile, updateProfile, loading } = useData();
    const [formState, setFormState] = useState<Profile>({});
    const [isSaved, setIsSaved] = useState(false);
    const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormState(profile);
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: name === 'age' ? (value === '' ? undefined : parseInt(value, 10)) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateProfile(formState);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };
    
    if (loading) {
        return <div className="text-center p-10">Loading profile...</div>;
    }

    const riskProfileDescription = {
        'Conservative': 'Low risk, lower potential return.',
        'Moderately Conservative': 'Relatively low risk, modest potential return.',
        'Moderate': 'Balanced risk and potential return.',
        'Moderately Aggressive': 'Higher risk, higher potential return.',
        'Aggressive': 'Highest risk, highest potential return.'
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Profile & Settings</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Your Profile</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This information helps personalize your financial advice.</p>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className={Label}>Full Name</label>
                            <input type="text" id="fullName" name="fullName" value={formState.fullName || ''} onChange={handleChange} className={Input} placeholder="e.g., Jane Doe" />
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                               <label htmlFor="birthDate" className={Label}>Date of Birth</label>
                               <input type="date" id="birthDate" name="birthDate" value={formState.birthDate || ''} onChange={handleChange} className={Input} />
                            </div>
                            <div>
                                <label htmlFor="gender" className={Label}>Gender</label>
                                <select id="gender" name="gender" value={formState.gender || ''} onChange={handleChange} className={Select}>
                                    <option value="">Select...</option>
                                    <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option><option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                                <label htmlFor="phone" className={Label}>Phone</label>
                                <input type="tel" id="phone" name="phone" value={formState.phone || ''} onChange={handleChange} className={Input} placeholder="+1 (555) 123-4567" />
                            </div>
                             <div>
                                <label htmlFor="email" className={Label}>Email</label>
                                <input type="email" id="email" name="email" value={formState.email || ''} onChange={handleChange} className={Input} placeholder="jane.doe@example.com" />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="address" className={Label}>Address</label>
                            <textarea id="address" name="address" value={formState.address || ''} onChange={handleChange} className={Textarea} placeholder="123 Main St, Anytown, USA 12345"></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="country" className={Label}>Country</label>
                                <input type="text" id="country" name="country" value={formState.country || ''} onChange={handleChange} className={Input} placeholder="e.g., Thailand" />
                            </div>
                            <div>
                                <label htmlFor="employmentStatus" className={Label}>Employment Status</label>
                                <select id="employmentStatus" name="employmentStatus" value={formState.employmentStatus || ''} onChange={handleChange} className={Select}>
                                    <option value="">Select...</option>
                                    <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Self-employed">Self-employed</option><option value="Unemployed">Unemployed</option><option value="Student">Student</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Taxes and Income Details</h2>
                     <div className="mt-4">
                        <label htmlFor="taxFilingStatus" className={Label}>Tax Filing Status</label>
                        <select id="taxFilingStatus" name="taxFilingStatus" value={formState.taxFilingStatus || ''} onChange={handleChange} className={Select}>
                            <option value="">Select...</option>
                            <option value="Single">Single</option>
                            <option value="Married filing jointly">Married filing jointly</option>
                            <option value="Married filing separately">Married filing separately</option>
                            <option value="Head of household">Head of household</option>
                            <option value="Qualifying widow(er)">Qualifying widow(er)</option>
                        </select>
                    </div>
                </Card>
                
                 <div className="pt-2 flex justify-end items-center gap-4">
                     {isSaved && <p className="text-sm text-green-600 dark:text-green-400 animate-in fade-in">Profile saved successfully!</p>}
                    <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-300">
                        <Save size={16} /> Save Profile
                    </button>
                </div>
            </form>

             <Card>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Risk Profile</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    This will impact your AI responses. If you have Origin Brokerage accounts, risk must be updated by navigating to the Brokerage tab.
                </p>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{riskProfile.calculatedRiskProfile || 'Not Set'}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {riskProfile.calculatedRiskProfile ? riskProfileDescription[riskProfile.calculatedRiskProfile] : 'Complete the questionnaire to determine your profile.'}
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsRiskModalOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 border dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 whitespace-nowrap"
                    >
                        Update Risk Profile
                    </button>
                </div>
                 <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                    Disclaimer: Origin AI will make recommendations based on available information, linked accounts, and risk profile. For full disclosure please see the link.
                </p>
            </Card>

            <RiskProfileModal
                isOpen={isRiskModalOpen}
                onClose={() => setIsRiskModalOpen(false)}
            />
        </div>
    );
};