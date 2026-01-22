
import { DEFAULT_CATEGORIES, DEFAULT_ACCOUNTS, DEFAULT_SUBSCRIPTIONS } from '../constants';
import type { AppData, Transaction } from '../types';

export const generateSeedData = (): AppData => {
    const accounts = [...DEFAULT_ACCOUNTS];
    const categories = [...DEFAULT_CATEGORIES];
    const transactions: Transaction[] = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    let balance = 75000;

    // Generate recurring transactions for the past 12 months
    for (let i = 0; i < 12; i++) {
        const month = currentMonth - i;
        const date = new Date(currentYear, month, 1);
        if (date > today) continue;

        // Salary
        const salaryDate = new Date(currentYear, month, 28);
        if (salaryDate <= today) {
            transactions.push({
                id: `tx-seed-salary-${i}`,
                date: salaryDate.toISOString(),
                amount: 60000,
                type: 'income',
                categoryId: 'income-salary',
                accountId: 'acc-2',
                note: 'Monthly Salary',
            });
            balance += 60000;
        }

        // Social Security
        transactions.push({
            id: `tx-seed-ss-${i}`,
            date: new Date(currentYear, month, 28).toISOString(),
            amount: 750,
            type: 'expense',
            categoryId: 'taxes-social-security',
            accountId: 'acc-2',
            note: 'Social Security',
        });
        balance -= 750;

        // Recurring Expenses
        const recurringExpenses = [
            { catId: 'expenses-housing-internet', amount: 640.93, note: 'Internet' },
            { catId: 'expenses-housing-phone', amount: 278.20, note: 'Phone Bill' },
            { catId: 'expenses-health-gym', amount: 1990, note: 'Fitness Membership' },
            { catId: 'expenses-subscriptions-netflix', amount: 105, note: 'Netflix' },
            { catId: 'expenses-subscriptions-youtube', amount: 90, note: 'YouTube Premium' },
            { catId: 'expenses-family-mom-phone', amount: 175, note: 'Mom Phone' },
            { catId: 'expenses-family-mom-electricity', amount: 650, note: 'Mom Electricity' },
            { catId: 'expenses-debt-cash-plus', amount: 1525, note: 'UOB Cash Plus' },
        ];

        recurringExpenses.forEach((exp, idx) => {
             transactions.push({
                id: `tx-seed-recurring-${i}-${idx}`,
                date: new Date(currentYear, month, 5 + idx).toISOString(),
                amount: exp.amount,
                type: 'expense',
                categoryId: exp.catId,
                accountId: 'acc-2',
                note: exp.note,
            });
            balance -= exp.amount;
        });
        
        // Random Food expenses
        for(let j=0; j < 8; j++) {
            const foodAmount = Math.floor(Math.random() * (1200 - 300 + 1)) + 300;
            transactions.push({
                 id: `tx-seed-food-${i}-${j}`,
                date: new Date(currentYear, month, Math.floor(Math.random() * 28) + 1).toISOString(),
                amount: foodAmount,
                type: 'expense',
                categoryId: 'expenses-food',
                accountId: 'acc-2',
                note: 'Groceries or Dining',
            });
            balance -= foodAmount;
        }
    }
    
    // Set final calculated balance
    const mainAccount = accounts.find(a => a.id === 'acc-2');
    if (mainAccount) {
        mainAccount.balance = balance;
    }


    const budgets = [
        {
            id: 'bud-1',
            categoryId: 'expenses-food',
            amount: 8660,
            period: 'monthly' as const,
            startDate: new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
        },
    ];

    const goals = [
        {
            id: 'goal-1',
            name: 'New Laptop',
            targetAmount: 100000,
            currentAmount: 25000,
            deadline: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()).toISOString(),
            category: 'Technology',
        },
    ];
    
    const subscriptions = [...DEFAULT_SUBSCRIPTIONS];

    return {
        transactions,
        categories,
        accounts,
        budgets,
        goals,
        subscriptions,
    };
};