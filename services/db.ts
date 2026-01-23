
import localforage from 'localforage';
import type { AppData, Transaction, Category, Account, Budget, Goal, Subscription, Profile, RiskProfile } from '../types';
import { generateSeedData } from './seedData';

const DB_NAME = 'personalFinanceDB';

// Configure localForage
localforage.config({
    name: DB_NAME,
    storeName: 'app_data',
    description: 'Local storage for Personal Finance App',
});

const KEYS = {
    PROFILE: 'profile',
    RISK_PROFILE: 'riskProfile',
    TRANSACTIONS: 'transactions',
    CATEGORIES: 'categories',
    ACCOUNTS: 'accounts',
    BUDGETS: 'budgets',
    GOALS: 'goals',
    SUBSCRIPTIONS: 'subscriptions',
};

async function seedInitialData() {
    const seedData = generateSeedData();
    await localforage.setItem(KEYS.PROFILE, seedData.profile);
    await localforage.setItem(KEYS.RISK_PROFILE, seedData.riskProfile);
    await localforage.setItem(KEYS.TRANSACTIONS, seedData.transactions);
    await localforage.setItem(KEYS.CATEGORIES, seedData.categories);
    await localforage.setItem(KEYS.ACCOUNTS, seedData.accounts);
    await localforage.setItem(KEYS.BUDGETS, seedData.budgets);
    await localforage.setItem(KEYS.GOALS, seedData.goals);
    await localforage.setItem(KEYS.SUBSCRIPTIONS, seedData.subscriptions);
    return seedData;
}

export const db = {
    async getAllData(): Promise<AppData> {
        const transactions = await localforage.getItem<Transaction[]>(KEYS.TRANSACTIONS);
        if (transactions === null) {
            console.log('No data found, seeding initial data...');
            return await seedInitialData();
        }

        const profile = await localforage.getItem<Profile>(KEYS.PROFILE) || {};
        const riskProfile = await localforage.getItem<RiskProfile>(KEYS.RISK_PROFILE) || {};
        const categories = await localforage.getItem<Category[]>(KEYS.CATEGORIES) || [];
        const accounts = await localforage.getItem<Account[]>(KEYS.ACCOUNTS) || [];
        const budgets = await localforage.getItem<Budget[]>(KEYS.BUDGETS) || [];
        const goals = await localforage.getItem<Goal[]>(KEYS.GOALS) || [];
        const subscriptions = await localforage.getItem<Subscription[]>(KEYS.SUBSCRIPTIONS) || [];

        return { profile, riskProfile, transactions, categories, accounts, budgets, goals, subscriptions };
    },

    async saveData(data: AppData): Promise<void> {
        await localforage.setItem(KEYS.PROFILE, data.profile);
        await localforage.setItem(KEYS.RISK_PROFILE, data.riskProfile);
        await localforage.setItem(KEYS.TRANSACTIONS, data.transactions);
        await localforage.setItem(KEYS.CATEGORIES, data.categories);
        await localforage.setItem(KEYS.ACCOUNTS, data.accounts);
        await localforage.setItem(KEYS.BUDGETS, data.budgets);
        await localforage.setItem(KEYS.GOALS, data.goals);
        await localforage.setItem(KEYS.SUBSCRIPTIONS, data.subscriptions);
    },

    async clearAllData(): Promise<void> {
        await localforage.clear();
    }
};