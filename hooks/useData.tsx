
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { AppData, Transaction, Budget, Goal, Account, Category, Subscription, Profile, RiskProfile, CreditCard } from '../types';
import { db } from '../services/db';

interface DataContextType extends AppData {
    loading: boolean;
    error: Error | null;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    updateTransaction: (transaction: Transaction) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    updateCategory: (category: Category) => Promise<void>;
    addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
    updateBudget: (budget: Budget) => Promise<void>;
    deleteBudget: (id: string) => Promise<void>;
    addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
    updateGoal: (goal: Goal) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;
    contributeToGoal: (goalId: string, amount: number, accountId: string) => Promise<void>;
    addSubscription: (subscription: Omit<Subscription, 'id'>) => Promise<void>;
    updateSubscription: (subscription: Subscription) => Promise<void>;
    deleteSubscription: (id: number | string) => Promise<void>;
    bulkAddSubscriptions: (subscriptions: Omit<Subscription, 'id'>[]) => Promise<void>;
    updateProfile: (profile: Profile) => Promise<void>;
    updateRiskProfile: (riskProfile: RiskProfile) => Promise<void>;
    addCreditCard: (card: Omit<CreditCard, 'id'>) => Promise<void>;
    updateCreditCard: (card: CreditCard) => Promise<void>;
    deleteCreditCard: (id: string) => Promise<void>;
    importData: (data: AppData) => Promise<void>;
    exportData: () => AppData;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<AppData>({
        profile: {},
        riskProfile: {},
        transactions: [],
        categories: [],
        accounts: [],
        budgets: [],
        goals: [],
        subscriptions: [],
        creditCards: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            let allData = await db.getAllData();
            
            // --- Auto-commit subscriptions ---
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            const newTransactions: Omit<Transaction, 'id'>[] = [];
            const activeSubs = allData.subscriptions.filter(s => s.status === 'Active' && s.expenseType === 'Recurring');

            for (const sub of activeSubs) {
                const lastCommittedTx = allData.transactions
                    .filter(t => t.subscriptionId === sub.id)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

                let nextDueDate: Date;

                if (lastCommittedTx) {
                    nextDueDate = new Date(lastCommittedTx.date);
                    if (sub.billingPeriod === 'Monthly') {
                        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                    } else {
                        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
                    }
                } else {
                    nextDueDate = new Date(sub.firstPayment);
                }
                
                nextDueDate.setHours(12, 0, 0, 0);
                
                while (nextDueDate <= today) {
                    if (sub.endDate && new Date(sub.endDate) < nextDueDate) {
                        break; // Stop if subscription has ended
                    }

                    const txDateString = nextDueDate.toISOString().split('T')[0];
                    const existingTx = allData.transactions.find(t => 
                        t.subscriptionId === sub.id &&
                        t.date.startsWith(txDateString)
                    );

                    if (!existingTx) {
                        let accountIdToUse = allData.accounts.find(a => a.name.toLowerCase().includes(sub.paymentMethod.toLowerCase()))?.id;
                        if (!accountIdToUse) {
                            accountIdToUse = allData.accounts.find(a => a.name.toLowerCase().includes('credit card'))?.id || allData.accounts[0]?.id;
                        }
                        
                        let categoryIdToUse = allData.categories.find(c => c.name.toLowerCase() === sub.name.toLowerCase() && c.parentCategoryId === 'expenses-subscriptions')?.id;
                        if (!categoryIdToUse) {
                            categoryIdToUse = 'expenses-subscriptions';
                        }

                        if (accountIdToUse) {
                            const newTx: Omit<Transaction, 'id'> = {
                                date: nextDueDate.toISOString(),
                                amount: sub.price,
                                type: 'expense',
                                categoryId: categoryIdToUse,
                                accountId: accountIdToUse,
                                note: `Subscription: ${sub.name}`,
                                subscriptionId: sub.id,
                            };
                            newTransactions.push(newTx);
                        }
                    }

                    if (sub.billingPeriod === 'Monthly') {
                        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                    } else {
                        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
                    }
                }
            }

            if (newTransactions.length > 0) {
                console.log(`Auto-committing ${newTransactions.length} subscription transactions.`);
                
                const finalNewTxs: Transaction[] = newTransactions.map((tx, i) => ({
                    ...tx,
                    id: `tx-sub-auto-${Date.now()}-${i}`
                }));

                const accountBalanceChanges: Record<string, number> = {};
                finalNewTxs.forEach(tx => {
                    accountBalanceChanges[tx.accountId] = (accountBalanceChanges[tx.accountId] || 0) - tx.amount;
                });

                const finalAccounts = allData.accounts.map(acc => {
                    if (accountBalanceChanges[acc.id]) {
                        return { ...acc, balance: acc.balance + accountBalanceChanges[acc.id] };
                    }
                    return acc;
                });
                
                allData = {
                    ...allData,
                    transactions: [...allData.transactions, ...finalNewTxs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                    accounts: finalAccounts
                };
                
                await db.saveData(allData);
            }
            // --- End of auto-commit logic ---

            setData(allData);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);
    
    const saveData = useCallback(async (newData: AppData) => {
        await db.saveData(newData);
        setData(newData);
    }, []);

    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = { ...transaction, id: `tx-${Date.now()}` };
        const newTransactions = [...data.transactions, newTransaction].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const newAccounts = data.accounts.map(acc => {
            if (acc.id === newTransaction.accountId) {
                const newBalance = newTransaction.type === 'income'
                    ? acc.balance + newTransaction.amount
                    : acc.balance - newTransaction.amount;
                return { ...acc, balance: newBalance };
            }
            return acc;
        });

        const newData = { ...data, transactions: newTransactions, accounts: newAccounts };
        await saveData(newData);
    };

    const updateTransaction = async (updatedTransaction: Transaction) => {
        const oldTransaction = data.transactions.find(t => t.id === updatedTransaction.id);
        if (!oldTransaction) return;

        const newTransactions = data.transactions.map(t =>
            t.id === updatedTransaction.id ? updatedTransaction : t
        ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const amountDifference = (updatedTransaction.type === 'income' ? updatedTransaction.amount : -updatedTransaction.amount) - (oldTransaction.type === 'income' ? oldTransaction.amount : -oldTransaction.amount);

        const newAccounts = data.accounts.map(acc => {
            if (acc.id === updatedTransaction.accountId && acc.id === oldTransaction.accountId) {
                return { ...acc, balance: acc.balance + amountDifference };
            }
            // Handle account change
            if (acc.id === oldTransaction.accountId) {
                return { ...acc, balance: acc.balance - (oldTransaction.type === 'income' ? oldTransaction.amount : -oldTransaction.amount) };
            }
            if (acc.id === updatedTransaction.accountId) {
                return { ...acc, balance: acc.balance + (updatedTransaction.type === 'income' ? updatedTransaction.amount : -updatedTransaction.amount) };
            }
            return acc;
        });

        const newData = { ...data, transactions: newTransactions, accounts: newAccounts };
        await saveData(newData);
    };

    const deleteTransaction = async (id: string) => {
        const transactionToDelete = data.transactions.find(t => t.id === id);
        if (!transactionToDelete) return;
        
        const newTransactions = data.transactions.filter(t => t.id !== id);
        
        const newAccounts = data.accounts.map(acc => {
             if (acc.id === transactionToDelete.accountId) {
                const newBalance = transactionToDelete.type === 'income'
                    ? acc.balance - transactionToDelete.amount
                    : acc.balance + transactionToDelete.amount;
                return { ...acc, balance: newBalance };
            }
            return acc;
        });
        
        const newData = { ...data, transactions: newTransactions, accounts: newAccounts };
        await saveData(newData);
    };

    const updateCategory = async (updatedCategory: Category) => {
        const newCategories = data.categories.map(c => c.id === updatedCategory.id ? updatedCategory : c);
        const newData = { ...data, categories: newCategories };
        await saveData(newData);
    };
    
    const addBudget = async (budget: Omit<Budget, 'id'>) => {
        const newBudget: Budget = { ...budget, id: `bud-${Date.now()}` };
        const newData = { ...data, budgets: [...data.budgets, newBudget] };
        await saveData(newData);
    };

    const updateBudget = async (updatedBudget: Budget) => {
        const newBudgets = data.budgets.map(b => b.id === updatedBudget.id ? updatedBudget : b);
        const newData = { ...data, budgets: newBudgets };
        await saveData(newData);
    };

    const deleteBudget = async (id: string) => {
        const newBudgets = data.budgets.filter(b => b.id !== id);
        const newData = { ...data, budgets: newBudgets };
        await saveData(newData);
    };
    
    const addGoal = async (goal: Omit<Goal, 'id'>) => {
        const newGoal: Goal = { ...goal, id: `goal-${Date.now()}` };
        const newData = { ...data, goals: [...data.goals, newGoal] };
        await saveData(newData);
    };

    const updateGoal = async (updatedGoal: Goal) => {
        const newGoals = data.goals.map(g => g.id === updatedGoal.id ? updatedGoal : g);
        const newData = { ...data, goals: newGoals };
        await saveData(newData);
    };

    const deleteGoal = async (id: string) => {
        const newGoals = data.goals.filter(g => g.id !== id);
        const newData = { ...data, goals: newGoals };
        await saveData(newData);
    };

    const contributeToGoal = async (goalId: string, amount: number, accountId: string) => {
        const goal = data.goals.find(g => g.id === goalId);
        const account = data.accounts.find(a => a.id === accountId);

        if (!goal || !account) {
            console.error("Goal or account not found");
            return;
        }

        if (account.balance < amount) {
            alert("Insufficient funds in the selected account.");
            return;
        }

        // 1. Update Goal
        const updatedGoal: Goal = { ...goal, currentAmount: goal.currentAmount + amount };
        const newGoals = data.goals.map(g => (g.id === goalId ? updatedGoal : g));

        // 2. Create Transaction for the contribution
        const newTransaction: Transaction = {
            id: `tx-${Date.now()}`,
            date: new Date().toISOString(),
            amount: amount,
            type: 'expense',
            categoryId: 'saving', // This is the ID for "4. Saving – เก็บออม"
            accountId: accountId,
            note: `Contribution to goal: ${goal.name}`,
        };
        const newTransactions = [...data.transactions, newTransaction];

        // 3. Update Account Balance
        const updatedAccount: Account = { ...account, balance: account.balance - amount };
        const newAccounts = data.accounts.map(a => (a.id === accountId ? updatedAccount : a));

        // 4. Save all changes
        const newData = { ...data, goals: newGoals, transactions: newTransactions, accounts: newAccounts };
        await saveData(newData);
    };
    
    const addSubscription = async (subscription: Omit<Subscription, 'id'>) => {
        const newSubscription: Subscription = { ...subscription, id: `sub-${Date.now()}` };
        const newSubscriptions = [...data.subscriptions, newSubscription];
        await saveData({ ...data, subscriptions: newSubscriptions });
    };

    const updateSubscription = async (updatedSubscription: Subscription) => {
        const newSubscriptions = data.subscriptions.map(s => s.id === updatedSubscription.id ? updatedSubscription : s);
        await saveData({ ...data, subscriptions: newSubscriptions });
    };

    const deleteSubscription = async (id: number | string) => {
        const newSubscriptions = data.subscriptions.filter(s => s.id !== id);
        await saveData({ ...data, subscriptions: newSubscriptions });
    };

    const bulkAddSubscriptions = async (subscriptionsToAdd: Omit<Subscription, 'id'>[]) => {
        const newSubscriptions: Subscription[] = subscriptionsToAdd.map((sub, index) => ({
            ...sub,
            id: `sub-${Date.now()}-${index}`
        }));
        const updatedSubscriptions = [...data.subscriptions, ...newSubscriptions];
        await saveData({ ...data, subscriptions: updatedSubscriptions });
    };

    const updateProfile = async (updatedProfile: Profile) => {
        const newData = { ...data, profile: updatedProfile };
        await saveData(newData);
    };

    const updateRiskProfile = async (updatedRiskProfile: RiskProfile) => {
        const newData = { ...data, riskProfile: updatedRiskProfile };
        await saveData(newData);
    };
    
    const addCreditCard = async (card: Omit<CreditCard, 'id'>) => {
        const newCard: CreditCard = { ...card, id: `cc-${Date.now()}` };
        const newData = { ...data, creditCards: [...data.creditCards, newCard] };
        await saveData(newData);
    };

    const updateCreditCard = async (updatedCard: CreditCard) => {
        const newCards = data.creditCards.map(c => c.id === updatedCard.id ? updatedCard : c);
        const newData = { ...data, creditCards: newCards };
        await saveData(newData);
    };

    const deleteCreditCard = async (id: string) => {
        const newCards = data.creditCards.filter(c => c.id !== id);
        const newData = { ...data, creditCards: newCards };
        await saveData(newData);
    };


    const importData = async (importedData: AppData) => {
        await saveData(importedData);
    };
    
    const exportData = () => {
        return data;
    };

    const value: DataContextType = {
        ...data,
        loading,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateCategory,
        addBudget,
        updateBudget,
        deleteBudget,
        addGoal,
        updateGoal,
        deleteGoal,
        contributeToGoal,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        bulkAddSubscriptions,
        updateProfile,
        updateRiskProfile,
        addCreditCard,
        updateCreditCard,
        deleteCreditCard,
        importData,
        exportData
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