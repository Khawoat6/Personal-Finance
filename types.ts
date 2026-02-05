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

export interface CardBenefit {
  id: string;
  description: string;
  category: 'Travel' | 'Dining' | 'Shopping' | 'Lifestyle' | 'Finance';
  used: boolean;
}

export interface CreditCard {
  id: string;
  name: string; // e.g., 'UOB Premier Miles'
  issuer: 'UOB' | 'KTC' | 'Citi' | 'SCB' | 'Kasikorn' | 'Krungsri' | 'Amex' | 'Other';
  last4: string;
  statementDate: number; // Day of the month
  dueDate: number; // Day of the month
  creditLimit: number;
  currentBalance: number;
  cardType: 'Visa' | 'Mastercard' | 'Amex' | 'JCB';
  color: string; // Hex code for card background
  benefits?: CardBenefit[];
}

export type ClosenessTier = 1 | 2 | 3 | 4 | 5 | 6;

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  birthday?: string;
  occupation?: string;
  firstMet?: string; // ISO 8601 format
  socials?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  relationship: 'Close Friend' | 'Family' | 'Relative' | 'University Friend' | 'Colleague' | 'Other';
  group?: string; // For custom clustering in graph view
  spouseId?: string;
  parents?: string[];
  connections?: string[]; // Array of other contact IDs
  closeness?: ClosenessTier;
  status?: 'Active' | 'Deceased' | 'Lost Contact' | 'Archived';
  isUser?: boolean;
}

export interface Tool {
    id: string;
    name: string;
    url: string;
    groupId: string;
    order: number;
}

export interface ToolGroup {
    id: string;
    title: string;
    order: number;
}

export interface LifemapSettings {
  lifemapName: string;
  dateOfBirth: string; // ISO string
  ageRange: number;
}

export interface LifemapCategory {
  id: string;
  name: string;
  section: 'top' | 'bottom';
  order: number;
}

export interface LifemapItem {
  id: string;
  categoryId: string;
  title: string;
  startAge: number;
  endAge: number | null; // null means it goes to the end
  color: 'blue' | 'red';
  hideText: boolean;
  lane?: number; // For rendering overlapping items
}

export interface AssetBeneficiary {
  contactId: string;
  percentage: number;
}

export interface SpecificGift {
  id: string;
  itemDescription: string;
  contactId: string;
}

export interface DigitalAsset {
  id: string;
  accountName: string;
  identifier: string; // username, email, wallet address, etc.
  accessInstructions?: string;
  wishes?: string;
}

export interface LastWill {
  executorId?: string;
  guardianId?: string;
  assetBeneficiaries: { [accountId: string]: AssetBeneficiary[] };
  specificGifts: SpecificGift[];
  digitalAssets: DigitalAsset[];
  finalWishes?: string;
}

export interface VisionBoardItem {
  id: string;
  year: number;
  imageUrl: string; // data URL or web URL
  title: string;
  notes?: string;
  order: number;
}

export interface AppData {
  profile: Profile;
  riskProfile: RiskProfile;
  creditCards: CreditCard[];
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  budgets: Budget[];
  goals: Goal[];
  subscriptions: Subscription[];
  contacts: Contact[];
  toolGroups: ToolGroup[];
  tools: Tool[];
  lastWill: LastWill;
  visionBoardItems: VisionBoardItem[];
}