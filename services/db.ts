import localforage from 'localforage';
import type { AppData, Transaction, Category, Account, Budget, Goal, Subscription, Profile, RiskProfile, CreditCard, Contact, ToolGroup, Tool, LastWill, VisionBoardItem, VisionBoardCategory, BookReview } from '../types';
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
    CREDIT_CARDS: 'creditCards',
    TRANSACTIONS: 'transactions',
    CATEGORIES: 'categories',
    ACCOUNTS: 'accounts',
    BUDGETS: 'budgets',
    GOALS: 'goals',
    SUBSCRIPTIONS: 'subscriptions',
    CONTACTS: 'contacts',
    TOOL_GROUPS: 'toolGroups',
    TOOLS: 'tools',
    LAST_WILL: 'lastWill',
    VISION_BOARD_ITEMS: 'visionBoardItems',
    VISION_BOARD_CATEGORIES: 'visionBoardCategories',
    BOOK_REVIEWS: 'bookReviews',
};

async function seedInitialData() {
    const seedData = generateSeedData();
    await localforage.setItem(KEYS.PROFILE, seedData.profile);
    await localforage.setItem(KEYS.RISK_PROFILE, seedData.riskProfile);
    await localforage.setItem(KEYS.CREDIT_CARDS, seedData.creditCards);
    await localforage.setItem(KEYS.TRANSACTIONS, seedData.transactions);
    await localforage.setItem(KEYS.CATEGORIES, seedData.categories);
    await localforage.setItem(KEYS.ACCOUNTS, seedData.accounts);
    await localforage.setItem(KEYS.BUDGETS, seedData.budgets);
    await localforage.setItem(KEYS.GOALS, seedData.goals);
    await localforage.setItem(KEYS.SUBSCRIPTIONS, seedData.subscriptions);
    await localforage.setItem(KEYS.CONTACTS, seedData.contacts);
    await localforage.setItem(KEYS.TOOL_GROUPS, seedData.toolGroups);
    await localforage.setItem(KEYS.TOOLS, seedData.tools);
    await localforage.setItem(KEYS.LAST_WILL, seedData.lastWill);
    await localforage.setItem(KEYS.VISION_BOARD_ITEMS, seedData.visionBoardItems);
    await localforage.setItem(KEYS.VISION_BOARD_CATEGORIES, seedData.visionBoardCategories);
    await localforage.setItem(KEYS.BOOK_REVIEWS, seedData.bookReviews);
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
        const creditCards = await localforage.getItem<CreditCard[]>(KEYS.CREDIT_CARDS) || [];
        const categories = await localforage.getItem<Category[]>(KEYS.CATEGORIES) || [];
        const accounts = await localforage.getItem<Account[]>(KEYS.ACCOUNTS) || [];
        const budgets = await localforage.getItem<Budget[]>(KEYS.BUDGETS) || [];
        const goals = await localforage.getItem<Goal[]>(KEYS.GOALS) || [];
        const subscriptions = await localforage.getItem<Subscription[]>(KEYS.SUBSCRIPTIONS) || [];
        const contacts = await localforage.getItem<Contact[]>(KEYS.CONTACTS) || [];
        const toolGroups = await localforage.getItem<ToolGroup[]>(KEYS.TOOL_GROUPS) || [];
        const tools = await localforage.getItem<Tool[]>(KEYS.TOOLS) || [];
        const lastWill = await localforage.getItem<LastWill>(KEYS.LAST_WILL) || { assetBeneficiaries: {}, specificGifts: [], digitalAssets: [] };
        const visionBoardItems = await localforage.getItem<VisionBoardItem[]>(KEYS.VISION_BOARD_ITEMS) || [];
        const visionBoardCategories = await localforage.getItem<VisionBoardCategory[]>(KEYS.VISION_BOARD_CATEGORIES) || [];
        const bookReviews = await localforage.getItem<BookReview[]>(KEYS.BOOK_REVIEWS) || [];
        
        // Ensure digitalAssets exists for backward compatibility
        if (!lastWill.digitalAssets) {
            lastWill.digitalAssets = [];
        }


        return { profile, riskProfile, creditCards, transactions, categories, accounts, budgets, goals, subscriptions, contacts, toolGroups, tools, lastWill, visionBoardItems, visionBoardCategories, bookReviews };
    },

    async saveData(data: AppData): Promise<void> {
        await localforage.setItem(KEYS.PROFILE, data.profile);
        await localforage.setItem(KEYS.RISK_PROFILE, data.riskProfile);
        await localforage.setItem(KEYS.CREDIT_CARDS, data.creditCards);
        await localforage.setItem(KEYS.TRANSACTIONS, data.transactions);
        await localforage.setItem(KEYS.CATEGORIES, data.categories);
        await localforage.setItem(KEYS.ACCOUNTS, data.accounts);
        await localforage.setItem(KEYS.BUDGETS, data.budgets);
        await localforage.setItem(KEYS.GOALS, data.goals);
        await localforage.setItem(KEYS.SUBSCRIPTIONS, data.subscriptions);
        await localforage.setItem(KEYS.CONTACTS, data.contacts);
        await localforage.setItem(KEYS.TOOL_GROUPS, data.toolGroups);
        await localforage.setItem(KEYS.TOOLS, data.tools);
        await localforage.setItem(KEYS.LAST_WILL, data.lastWill);
        await localforage.setItem(KEYS.VISION_BOARD_ITEMS, data.visionBoardItems);
        await localforage.setItem(KEYS.VISION_BOARD_CATEGORIES, data.visionBoardCategories);
        await localforage.setItem(KEYS.BOOK_REVIEWS, data.bookReviews);
    },

    async clearAllData(): Promise<void> {
        await localforage.clear();
    }
};