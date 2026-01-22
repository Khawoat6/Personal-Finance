
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { AppData, Transaction, Budget, Goal, Account, Category, Subscription } from '../types';
import { supabase } from '../services/db';
import { useAuth } from './useAuth';
import { generateSeedData } from '../services/seedData';

interface DataContextType extends AppData {
    loading: boolean;
    error: Error | null;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id'>) => Promise<void>;
    updateTransaction: (transaction: Transaction) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    updateCategory: (category: Category) => Promise<void>;
    addBudget: (budget: Omit<Budget, 'id' | 'user_id'>) => Promise<void>;
    updateBudget: (budget: Budget) => Promise<void>;
    deleteBudget: (id: string) => Promise<void>;
    addGoal: (goal: Omit<Goal, 'id' | 'user_id'>) => Promise<void>;
    updateGoal: (goal: Goal) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;
    addSubscription: (subscription: Omit<Subscription, 'id' | 'user_id'>) => Promise<void>;
    updateSubscription: (subscription: Subscription) => Promise<void>;
    deleteSubscription: (id: number | string) => Promise<void>;
    importData: (data: AppData) => Promise<void>;
    exportData: () => AppData;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [data, setData] = useState<AppData>({
        transactions: [], categories: [], accounts: [],
        budgets: [], goals: [], subscriptions: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const seedDataForNewUser = useCallback(async (userId: string) => {
        console.log("Seeding data for new user:", userId);
        const seedData = generateSeedData();
        
        const addUserId = <T extends {}>(items: T[]): (T & { user_id: string })[] => items.map(item => ({ ...item, user_id: userId }));

        const { error: catError } = await supabase.from('categories').insert(addUserId(seedData.categories));
        if (catError) throw catError;
        const { error: accError } = await supabase.from('accounts').insert(addUserId(seedData.accounts));
        if (accError) throw accError;
        const { error: subError } = await supabase.from('subscriptions').insert(addUserId(seedData.subscriptions));
        if (subError) throw subError;
        
        // After seeding, we should have some base data
        return await loadData(userId, true);
    }, []);
    
    const loadData = useCallback(async (userId: string, isSeeding: boolean = false) => {
        try {
            if (!isSeeding) setLoading(true);
            
            // Check if user has any data, categories is a good proxy
            const { data: checkData, error: checkError } = await supabase.from('categories').select('id').eq('user_id', userId).limit(1);
            if (checkError) throw checkError;

            if (checkData.length === 0) {
                 const seededData = await seedDataForNewUser(userId);
                 setData(seededData);
                 return seededData;
            }

            const [
                { data: transactions, error: tError },
                { data: categories, error: cError },
                { data: accounts, error: aError },
                { data: budgets, error: bError },
                { data: goals, error: gError },
                { data: subscriptions, error: sError },
            ] = await Promise.all([
                supabase.from('transactions').select('*').eq('user_id', userId),
                supabase.from('categories').select('*').eq('user_id', userId),
                supabase.from('accounts').select('*').eq('user_id', userId),
                supabase.from('budgets').select('*').eq('user_id', userId),
                supabase.from('goals').select('*').eq('user_id', userId),
                supabase.from('subscriptions').select('*').eq('user_id', userId),
            ]);

            if (tError || cError || aError || bError || gError || sError) throw tError || cError || aError || bError || gError || sError;

            const allData = { transactions, categories, accounts, budgets, goals, subscriptions } as AppData;
            setData(allData);
            return allData;

        } catch (err) {
            setError(err as Error);
            console.error("Error loading data:", err);
            return data;
        } finally {
            if (!isSeeding) setLoading(false);
        }
    }, [seedDataForNewUser]);

    useEffect(() => {
        if (user) {
            loadData(user.id);
        } else {
            setData({ transactions: [], categories: [], accounts: [], budgets: [], goals: [], subscriptions: [] });
            setLoading(false);
        }
    }, [user, loadData]);

    const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id'>) => {
        if (!user) return;
        const { data: newTransaction, error } = await supabase.from('transactions')
          .insert({ ...transaction, user_id: user.id })
          .select()
          .single();
        if (error) throw error;
        
        setData(prev => ({ ...prev, transactions: [...prev.transactions, newTransaction] }));
        
        // Update account balance
        const acc = data.accounts.find(a => a.id === newTransaction.accountId);
        if (acc) {
            const newBalance = newTransaction.type === 'income' ? acc.balance + newTransaction.amount : acc.balance - newTransaction.amount;
            const { error: accError } = await supabase.from('accounts').update({ balance: newBalance }).eq('id', acc.id);
            if (accError) throw accError;
            setData(prev => ({ ...prev, accounts: prev.accounts.map(a => a.id === acc.id ? { ...a, balance: newBalance } : a) }));
        }
    };

    const updateTransaction = async (updatedTransaction: Transaction) => {
        // Logic to revert old transaction effect and apply new one on account balances
        // This can be complex, for simplicity, we'll just update the transaction
        const { data: newTransaction, error } = await supabase.from('transactions')
          .update(updatedTransaction)
          .eq('id', updatedTransaction.id)
          .select()
          .single();
        if (error) throw error;
        // Ideally, we'd refetch balances or calculate locally. For now, we'll just update the transaction list.
        // A page reload or subsequent data fetch would fix balances.
        setData(prev => ({ ...prev, transactions: prev.transactions.map(t => t.id === newTransaction.id ? newTransaction : t)}));
        if(user) await loadData(user.id); // Refresh data to ensure consistency
    };

    const deleteTransaction = async (id: string) => {
        const txToDelete = data.transactions.find(t => t.id === id);
        if (!txToDelete || !user) return;
        
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (error) throw error;
        
        setData(prev => ({...prev, transactions: prev.transactions.filter(t => t.id !== id)}));
        if(user) await loadData(user.id); // Refresh data to ensure consistency
    };

    // Placeholder functions for other types
    const updateCategory = async (cat: Category) => {
        const {data: newCat, error} = await supabase.from('categories').update(cat).eq('id', cat.id).select().single();
        if(error) throw error;
        setData(prev => ({...prev, categories: prev.categories.map(c => c.id === newCat.id ? newCat : c)}));
    };
    const addSubscription = async (sub: Omit<Subscription, 'id' | 'user_id'>) => {
        if (!user) return;
        const { data: newSub, error } = await supabase.from('subscriptions').insert({...sub, user_id: user.id}).select().single();
        if (error) throw error;
        setData(prev => ({...prev, subscriptions: [...prev.subscriptions, newSub]}));
    };
    const updateSubscription = async (sub: Subscription) => {
        const { data: newSub, error } = await supabase.from('subscriptions').update(sub).eq('id', sub.id).select().single();
        if (error) throw error;
        setData(prev => ({...prev, subscriptions: prev.subscriptions.map(s => s.id === newSub.id ? newSub : s)}));
    };
    const deleteSubscription = async (id: number | string) => {
        const { error } = await supabase.from('subscriptions').delete().eq('id', id);
        if (error) throw error;
        setData(prev => ({...prev, subscriptions: prev.subscriptions.filter(s => s.id !== id)}));
    };

    // Generic placeholder functions for unimplemented features
    const placeholder = async (name: string) => { console.warn(`${name} is not implemented for Supabase yet.`); };
    const addBudget = async () => placeholder('addBudget');
    const updateBudget = async () => placeholder('updateBudget');
    const deleteBudget = async () => placeholder('deleteBudget');
    const addGoal = async () => placeholder('addGoal');
    const updateGoal = async () => placeholder('updateGoal');
    const deleteGoal = async () => placeholder('deleteGoal');
    const importData = async () => placeholder('importData');
    const exportData = () => { console.warn('exportData not fully implemented'); return data; };


    const value: DataContextType = {
        ...data, loading, error, addTransaction, updateTransaction, deleteTransaction,
        updateCategory, addBudget, updateBudget, deleteBudget, addGoal, updateGoal, deleteGoal,
        addSubscription, updateSubscription, deleteSubscription, importData, exportData
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
