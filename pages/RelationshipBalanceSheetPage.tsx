import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Card } from '../components/ui/Card';
import { ArrowUpCircle, ArrowDownCircle, Scale, User, Users } from 'lucide-react';
import type { Contact } from '../types';

// Scoring system for relationships
const TIER_SCORES: { [key: number]: number } = {
    1: 10, // BFFs
    2: 7,  // Close
    3: 5,  // Fun
    4: 2,  // Neutral
    5: 1,  // Acquaintance
    6: -10 // Blacklist
};
const STATUS_SCORES: { [key: string]: number } = {
    'Lost Contact': -2,
    'Archived': -5,
};

interface ScoredContact extends Contact {
    score: number;
}

const RelationshipListItem: React.FC<{ contact: ScoredContact }> = ({ contact }) => {
    const isAsset = contact.score > 0;
    return (
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <div className="flex items-center gap-3">
                <img src={contact.photoUrl || `https://ui-avatars.com/api/?name=${contact.firstName}+${contact.lastName}&background=random`} alt="" className="w-8 h-8 rounded-full object-cover" />
                <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{contact.firstName} {contact.lastName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {contact.closeness ? `Tier ${contact.closeness}` : contact.status}
                    </p>
                </div>
            </div>
            <span className={`text-sm font-bold ${isAsset ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                {isAsset ? '+' : ''}{contact.score}
            </span>
        </div>
    );
};

export const RelationshipBalanceSheetPage: React.FC = () => {
    const { contacts, loading } = useData();

    const { assets, liabilities, totalAssetScore, totalLiabilityScore } = useMemo(() => {
        const assets: ScoredContact[] = [];
        const liabilities: ScoredContact[] = [];
        let totalAssetScore = 0;
        let totalLiabilityScore = 0;

        contacts.forEach(contact => {
            let score = 0;
            if (contact.closeness) {
                score += TIER_SCORES[contact.closeness] || 0;
            }
            if (contact.status && STATUS_SCORES[contact.status]) {
                score += STATUS_SCORES[contact.status];
            }

            if (score > 0) {
                assets.push({ ...contact, score });
                totalAssetScore += score;
            } else if (score < 0) {
                liabilities.push({ ...contact, score });
                totalLiabilityScore += score;
            }
        });

        assets.sort((a, b) => b.score - a.score);
        liabilities.sort((a, b) => a.score - b.score);

        return { assets, liabilities, totalAssetScore, totalLiabilityScore };
    }, [contacts]);

    const netSocialCapital = totalAssetScore + totalLiabilityScore;
    const totalValue = totalAssetScore - totalLiabilityScore;
    const assetPercentage = totalValue > 0 ? (totalAssetScore / totalValue) * 100 : 0;

    if (loading) {
        return <div className="text-center p-10">Analyzing your relationships...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif text-zinc-900 dark:text-slate-100">Relationship Balance Sheet</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">An analytical view of your social network, quantifying connections as assets and liabilities.</p>
            </div>

            <Card>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Social Capital Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Relationship Assets</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{totalAssetScore}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Relationship Liabilities</p>
                        <p className="text-3xl font-bold text-red-500 dark:text-red-400">{totalLiabilityScore}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Net Social Capital</p>
                        <p className={`text-3xl font-bold ${netSocialCapital >= 0 ? 'text-slate-800 dark:text-slate-200' : 'text-red-500'}`}>
                            {netSocialCapital}
                        </p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t dark:border-slate-700">
                    <div className="w-full bg-red-500/20 rounded-full h-3 dark:bg-red-900/40">
                        <div 
                            className="bg-green-500/50 dark:bg-green-500/70 h-3 rounded-full" 
                            style={{ width: `${assetPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </Card>

            {contacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                            <ArrowUpCircle className="text-green-500" /> Relationship Assets
                        </h3>
                        <div className="space-y-1">
                            {assets.map(contact => <RelationshipListItem key={contact.id} contact={contact} />)}
                            {assets.length === 0 && <p className="text-sm text-center py-8 text-slate-500">No positive-rated contacts found.</p>}
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                            <ArrowDownCircle className="text-red-500" /> Relationship Liabilities
                        </h3>
                         <div className="space-y-1">
                            {liabilities.map(contact => <RelationshipListItem key={contact.id} contact={contact} />)}
                            {liabilities.length === 0 && <p className="text-sm text-center py-8 text-slate-500">No negative-rated contacts found.</p>}
                        </div>
                    </Card>
                </div>
            ) : (
                 <Card className="text-center py-16 border-dashed border-2">
                    <Users className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-4 text-lg font-semibold">No Contacts Found</h3>
                    <p className="text-slate-500 mt-1">Add contacts in the 'Relationships' page to build your balance sheet.</p>
                </Card>
            )}

        </div>
    );
};
