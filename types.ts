
export interface Transaction {
  id: string;
  date: string; // ISO 8601 format
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  accountId: string;
  note?: string;
  tags?: string[];
  subscriptionId?: number | string;
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
  category?: string;
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

export interface Profile {
  fullName?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  location?: string;
  employmentStatus?: 'Full-time' | 'Part-time' | 'Self-employed' | 'Unemployed' | 'Student';
  birthDate?: string;
  address?: string;
  phone?: string;
  country?: string;
  email?: string;
  taxFilingStatus?: 'Single' | 'Married filing jointly' | 'Married filing separately' | 'Head of household' | 'Qualifying widow(er)';
}

export interface RiskProfile {
  objective?: 'Capital Preservation' | 'Income' | 'Growth' | 'Aggressive Growth';
  riskTolerance?: 'Conservative' | 'Moderately Conservative' | 'Moderate' | 'Moderately Aggressive' | 'Aggressive';
  timeHorizon?: 'Short-term (< 3 years)' | 'Medium-term (3-7 years)' | 'Long-term (7-15 years)' | 'Very long-term (> 15 years)';
  liquidityNeeds?: 'Within 1 year' | '1-3 years' | '3-5 years' | '> 5 years';
  calculatedRiskProfile?: 'Conservative' | 'Moderately Conservative' | 'Moderate' | 'Moderately Aggressive' | 'Aggressive';
}

export interface AppData {
  profile: Profile;
  riskProfile: RiskProfile;
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  budgets: Budget[];
  goals: Goal[];
  subscriptions: Subscription[];
}