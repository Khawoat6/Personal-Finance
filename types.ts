
export interface Transaction {
  id: string;
  date: string; // ISO 8601 format
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  accountId: string;
  note?: string;
  tags?: string[];
}

export interface Category {
  id:string;
  name: string;
  type: 'income' | 'expense';
  group?: 'saving' | 'investing';
  icon: string; // e.g., 'Home', 'Car', 'Shopping' for icon mapping
  parentCategoryId?: string | null;
  monthlyBudgets?: number[]; // Array of 12 numbers for monthly budgets
}

export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly'; // Can be extended later
  startDate: string; // ISO 8601 format
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO 8601 format
}

export interface Subscription {
  id: number | string;
  name: string;
  category: string;
  price: number;
  expenseType: 'Recurring' | 'One-Time';
  billingPeriod: 'Monthly' | 'Yearly';
  billingDay: number;
  firstPayment: string;
  endDate: string;
  paymentMethod: string;
  website: string;
  status: 'Active' | 'Inactive';
  logoUrl: string;
  email?: string;
  signupMethod?: string;
  signupIdentifier?: string;
  usage?: 'High' | 'Medium' | 'Low' | 'Unused';
}

export interface AppData {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  budgets: Budget[];
  goals: Goal[];
  subscriptions: Subscription[];
}