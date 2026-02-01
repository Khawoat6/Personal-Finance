
import type { Category, Account, Subscription, CreditCard, Contact } from './types';

const fillYear = (value: number) => Array(12).fill(value);

export const DEFAULT_CATEGORIES: Category[] = [
    // --- 1. Income ---
    { id: 'income', name: '1. Income – รายได้', type: 'income', icon: 'DollarSign' },
    { id: 'income-salary', name: 'Salary – เงินเดือน', type: 'income', icon: 'Briefcase', parentCategoryId: 'income', monthlyBudgets: fillYear(60000) },
    { id: 'income-bonus', name: 'Bonus – โบนัส', type: 'income', icon: 'Award', parentCategoryId: 'income' },
    { id: 'income-dividend', name: 'Dividend Stocks – หุ้นปันผล', type: 'income', icon: 'TrendingUp', parentCategoryId: 'income' },
    { id: 'income-side-hustle', name: 'Side income – รายได้เสริม', type: 'income', icon: 'Star', parentCategoryId: 'income' },
    { id: 'income-courses', name: 'Selling Courses – ขายคอร์สเรียน', type: 'income', icon: 'BookOpen', parentCategoryId: 'income' },
    { id: 'income-hysas', name: 'HYSAs – บัญชีออมทรัพย์ดอกเบี้ยสูง', type: 'income', icon: 'Landmark', parentCategoryId: 'income' },
    { id: 'income-rental', name: 'Rental Property – ปล่อยเช่าอสังหาริมทรัพย์', type: 'income', icon: 'Building', parentCategoryId: 'income' },
    { id: 'income-reits', name: 'REITs – กองทุนรวมอสังหาริมทรัพย์', type: 'income', icon: 'Building2', parentCategoryId: 'income' },
    { id: 'income-bonds', name: 'Bonds – พันธบัตร', type: 'income', icon: 'FileText', parentCategoryId: 'income' },
    { id: 'income-ecommerce', name: 'E-Commerce - ขายของออนไลน์', type: 'income', icon: 'ShoppingBag', parentCategoryId: 'income' },
    { id: 'income-ebooks', name: 'Selling eBooks – ขายหนังสืออิเล็กทรอนิกส์', type: 'income', icon: 'Book', parentCategoryId: 'income' },
    { id: 'income-affiliate', name: 'Affiliate Marketing – การตลาดแบบพันธมิตร', type: 'income', icon: 'Link', parentCategoryId: 'income' },
    { id: 'income-blogging', name: 'Blogging – เขียนบล็อก', type: 'income', icon: 'PenSquare', parentCategoryId: 'income' },
    { id: 'income-youtube', name: 'YouTube Channel – ช่องยูทูบ', type: 'income', icon: 'Youtube', parentCategoryId: 'income' },
    { id: 'income-ig-reels', name: 'IG Reel Bonus – รายได้โบนัสจาก Reels', type: 'income', icon: 'Instagram', parentCategoryId: 'income' },
    { id: 'income-sponsorships', name: 'Sponsorships – รายได้จากค่าจ้างรีวิวสินค้า', type: 'income', icon: 'Megaphone', parentCategoryId: 'income' },

    // --- 2. Taxes & Contributions ---
    { id: 'taxes', name: '2. Taxes & Contributions – ภาษีและเงินสมทบ', type: 'expense', icon: 'FileText' },
    { id: 'taxes-withholding', name: 'Withholding tax – ภาษีหัก ณ ที่จ่าย', type: 'expense', icon: 'FileMinus', parentCategoryId: 'taxes' },
    { id: 'taxes-social-security', name: 'Social security – ประกันสังคม', type: 'expense', icon: 'Shield', parentCategoryId: 'taxes', monthlyBudgets: fillYear(750) },
    { id: 'taxes-personal-income', name: 'Personal income tax – ภาษีเงินได้บุคคลธรรมดา', type: 'expense', icon: 'FilePlus', parentCategoryId: 'taxes' },
    { id: 'taxes-provident', name: 'Provident fund – กองทุนสำรองเลี้ยงชีพ', type: 'expense', icon: 'Database', parentCategoryId: 'taxes' },
    { id: 'taxes-other-gov', name: 'Other government contributions – เงินสมทบภารัฐอื่น ๆ', type: 'expense', icon: 'Library', parentCategoryId: 'taxes' },


    // --- 4. Saving ---
    { id: 'saving', name: '4. Saving – เก็บออม', type: 'expense', group: 'saving', icon: 'PiggyBank', monthlyBudgets: fillYear(34640) },

    // --- 5. Investing ---
    { id: 'investing', name: '5. Investing – ลงทุน', type: 'expense', group: 'investing', icon: 'Activity' },
    // 5.1 Equities
    { id: 'investing-equities', name: 'Equities – หุ้น', type: 'expense', group: 'investing', parentCategoryId: 'investing', icon: 'BarChart2' },
    { id: 'investing-equities-common', name: 'Common stocks – หุ้นสามัญ', type: 'expense', group: 'investing', parentCategoryId: 'investing-equities', icon: 'BarChartHorizontal' },
    { id: 'investing-equities-preferred', name: 'Preferred stocks – หุ้นบุริมสิทธิ', type: 'expense', group: 'investing', parentCategoryId: 'investing-equities', icon: 'BarChartHorizontal' },
    { id: 'investing-equities-etf', name: 'Equity ETFs – กองทุน ETF', type: 'expense', group: 'investing', parentCategoryId: 'investing-equities', icon: 'Package' },
    { id: 'investing-equities-emerging', name: 'Emerging markets equities – หุ้นในตลาดเกิดใหม่', type: 'expense', group: 'investing', parentCategoryId: 'investing-equities', icon: 'Globe' },
    // 5.2 Fixed Income
    { id: 'investing-fixed-income', name: 'Fixed Income – ตราสารหนี้', type: 'expense', group: 'investing', parentCategoryId: 'investing', icon: 'FileStack' },
    { id: 'investing-fixed-income-gov', name: 'Government bonds – พันธบัตรรัฐบาล', type: 'expense', group: 'investing', parentCategoryId: 'investing-fixed-income', icon: 'Landmark' },
    { id: 'investing-fixed-income-corp', name: 'Corporate bonds – พันธบัตรเอกชน', type: 'expense', group: 'investing', parentCategoryId: 'investing-fixed-income', icon: 'Building' },
    { id: 'investing-fixed-income-short', name: 'Short-term debt instruments – ตราสารหนี้ระยะสั้น', type: 'expense', group: 'investing', parentCategoryId: 'investing-fixed-income', icon: 'FileClock' },
    // 5.3 Cash & Cash Equivalents
    { id: 'investing-cash', name: 'Cash & Cash Equivalents – เงินสดและสินทรัพย์เทียบเท่าเงินสด', type: 'expense', group: 'investing', parentCategoryId: 'investing', icon: 'Wallet' },
    { id: 'investing-cash-savings', name: 'Savings accounts – บัญชีออมทรัพย์', type: 'expense', group: 'investing', parentCategoryId: 'investing-cash', icon: 'PiggyBank' },
    { id: 'investing-cash-deposits', name: 'Time deposits – เงินฝากประจำ', type: 'expense', group: 'investing', parentCategoryId: 'investing-cash', icon: 'CalendarClock' },
    { id: 'investing-cash-money-market', name: 'Money market funds – กองทุนตลาดเงิน', type: 'expense', group: 'investing', parentCategoryId: 'investing-cash', icon: 'Coins' },
    // 5.4 Real Assets
    { id: 'investing-real-assets', name: 'Real Assets – สินทรัพย์จริง', type: 'expense', group: 'investing', parentCategoryId: 'investing', icon: 'Gem' },
    { id: 'investing-real-assets-estate', name: 'Real estate – อสังหาริมทรัพย์', type: 'expense', group: 'investing', parentCategoryId: 'investing-real-assets', icon: 'Home' },
    { id: 'investing-real-assets-commodities', name: 'Commodities – สินค้าโภคภัณฑ์', type: 'expense', group: 'investing', parentCategoryId: 'investing-real-assets', icon: 'Boxes' },
    { id: 'investing-real-assets-gold', name: 'Gold – ทองคำ', type: 'expense', group: 'investing', parentCategoryId: 'investing-real-assets-commodities', icon: 'CircleDollarSign' },
    { id: 'investing-real-assets-oil', name: 'Oil – น้ำมัน', type: 'expense', group: 'investing', parentCategoryId: 'investing-real-assets-commodities', icon: 'Fuel' },
    { id: 'investing-real-assets-agri', name: 'Agricultural products – สินค้าเกษตร', type: 'expense', group: 'investing', parentCategoryId: 'investing-real-assets-commodities', icon: 'Leaf' },
    // 5.5 Alternative Investments
    { id: 'investing-alternative', name: 'Alternative Investments – การลงทุนทางเลือก', type: 'expense', group: 'investing', parentCategoryId: 'investing', icon: 'Diamond' },
    { id: 'investing-alternative-private-equity', name: 'Private equity – หุ้นนอกตลาดหลักทรัพย์', type: 'expense', group: 'investing', parentCategoryId: 'investing-alternative', icon: 'Briefcase' },
    { id: 'investing-alternative-vc', name: 'Venture capital – เงินลงทุนในธุรกิจสตาร์ทอัพ', type: 'expense', group: 'investing', parentCategoryId: 'investing-alternative', icon: 'Rocket' },
    { id: 'investing-alternative-collectibles', name: 'Collectibles – ของสะสม', type: 'expense', group: 'investing', parentCategoryId: 'investing-alternative', icon: 'GalleryThumbnails' },
    { id: 'investing-alternative-bitcoin', name: 'Bitcoin - บิทคอย', type: 'expense', group: 'investing', parentCategoryId: 'investing-alternative', icon: 'Bitcoin' },
    { id: 'investing-alternative-crypto', name: 'Cryptocurrencies – สกุลเงินดิจิทัล', type: 'expense', group: 'investing', parentCategoryId: 'investing-alternative', icon: 'Cpu' },
    
    // --- 7. Expenses ---
    { id: 'expenses', name: '7. Expenses – ค่าใช้จ่าย', type: 'expense', icon: 'ShoppingCart' },
    // 7.1 Housing
    { id: 'expenses-housing', name: '7.1 Housing – ที่อยู่อาศัย', type: 'expense', parentCategoryId: 'expenses', icon: 'Home' },
    { id: 'expenses-housing-rent', name: 'Rent – ค่าเช่า', type: 'expense', parentCategoryId: 'expenses-housing', monthlyBudgets: fillYear(0), icon: 'Key' },
    { id: 'expenses-housing-water', name: 'Water – ค่าน้ำ', type: 'expense', parentCategoryId: 'expenses-housing', monthlyBudgets: fillYear(100), icon: 'Droplet' },
    { id: 'expenses-housing-electricity', name: 'Electricity – ค่าไฟ', type: 'expense', parentCategoryId: 'expenses-housing', monthlyBudgets: fillYear(800), icon: 'Zap' },
    { id: 'expenses-housing-internet', name: 'Internet – True WiFi', type: 'expense', parentCategoryId: 'expenses-housing', monthlyBudgets: fillYear(640.93), icon: 'Wifi' },
    { id: 'expenses-housing-phone', name: 'ค่าโทรศัพท์ DTAC', type: 'expense', parentCategoryId: 'expenses-housing', monthlyBudgets: fillYear(278.20), icon: 'Phone' },

    // 7.2 Food
    { id: 'expenses-food', name: '7.2 Food – อาหาร', type: 'expense', parentCategoryId: 'expenses', icon: 'Coffee', monthlyBudgets: fillYear(8660) },

    // 7.3 Transportation
    { id: 'expenses-transportation', name: '7.3 Transportation – การเดินทาง', type: 'expense', parentCategoryId: 'expenses', icon: 'Car' },
    { id: 'expenses-transportation-loan', name: 'Personal Car Loan - ผ่อนงวดรถยนต์', type: 'expense', parentCategoryId: 'expenses-transportation', icon: 'Banknote' },
    { id: 'expenses-transportation-fuel', name: 'Fuel – ค่าน้ำมัน', type: 'expense', parentCategoryId: 'expenses-transportation', monthlyBudgets: fillYear(3000), icon: 'Fuel' },
    { id: 'expenses-transportation-tax', name: 'Vehicle tax – ภาษีรถยนต์', type: 'expense', parentCategoryId: 'expenses-transportation', monthlyBudgets: fillYear(53.77), icon: 'FileText' }, // 645.21 / 12
    { id: 'expenses-transportation-insurance', name: 'Car insurance – ประกันรถยนต์ 2+', type: 'expense', parentCategoryId: 'expenses-transportation', monthlyBudgets: fillYear(594.30), icon: 'ShieldCheck' },
    { id: 'expenses-transportation-maintenance', name: 'Maintenance & Repairs – ค่าซ่อมบำรุง', type: 'expense', parentCategoryId: 'expenses-transportation', monthlyBudgets: fillYear(467), icon: 'Wrench' },
    { id: 'expenses-transportation-tolls', name: 'Toll fees – ค่าทางด่วน', type: 'expense', parentCategoryId: 'expenses-transportation', monthlyBudgets: fillYear(300), icon: 'Ticket' },


    // 7.4 Health & Fitness
    { id: 'expenses-health', name: '7.4 Health & Fitness – สุขภาพ', type: 'expense', parentCategoryId: 'expenses', icon: 'Heart' },
    { id: 'expenses-health-gym', name: 'Fitness Membership', type: 'expense', parentCategoryId: 'expenses-health', monthlyBudgets: fillYear(1990), icon: 'Dumbbell' },

    // 7.5 Subscriptions & Utilities
    { id: 'expenses-subscriptions', name: '7.5 Subscriptions & Utilities', type: 'expense', parentCategoryId: 'expenses', icon: 'Repeat' },
    { id: 'expenses-subscriptions-netflix', name: 'Netflix', type: 'expense', parentCategoryId: 'expenses-subscriptions', monthlyBudgets: fillYear(105), icon: 'MonitorPlay' },
    { id: 'expenses-subscriptions-spotify', name: 'Spotify', type: 'expense', parentCategoryId: 'expenses-subscriptions', monthlyBudgets: fillYear(45), icon: 'Music' },
    { id: 'expenses-subscriptions-youtube', name: 'YouTube Premium', type: 'expense', parentCategoryId: 'expenses-subscriptions', monthlyBudgets: fillYear(90), icon: 'Youtube' },
    { id: 'expenses-subscriptions-chatgpt', name: 'ChatGPT', type: 'expense', parentCategoryId: 'expenses-subscriptions', monthlyBudgets: fillYear(699), icon: 'BrainCircuit' },
    { id: 'expenses-subscriptions-icloud', name: 'iCloud', type: 'expense', parentCategoryId: 'expenses-subscriptions', monthlyBudgets: fillYear(200), icon: 'Cloud' },
    
    // 7.8 Family & Donation
    { id: 'expenses-family', name: '7.8 Family & Donation', type: 'expense', parentCategoryId: 'expenses', icon: 'Users' },
    { id: 'expenses-family-mom-phone', name: 'Internet – ค่าโทรศัพท์แม่', type: 'expense', parentCategoryId: 'expenses-family', monthlyBudgets: fillYear(175), icon: 'Smartphone' },
    { id: 'expenses-family-mom-electricity', name: 'Electricity – ค่าไฟบ้านแม่', type: 'expense', parentCategoryId: 'expenses-family', monthlyBudgets: fillYear(600), icon: 'Zap' },
    { id: 'expenses-family-mom-internet', name: 'Internet – ค่าอินเทอร์เน็ต NT WiFi', type: 'expense', parentCategoryId: 'expenses-family', monthlyBudgets: fillYear(278.20), icon: 'Wifi' },
    
    // 10. Debt Payments
    { id: 'expenses-debt', name: '10. จ่ายหนี้ ที่อยู่ในเครดิตบูโร', type: 'expense', parentCategoryId: 'expenses', icon: 'CreditCard' },
    { id: 'expenses-debt-uob', name: 'Credit Card - UOB Premier', type: 'expense', parentCategoryId: 'expenses-debt', icon: 'CreditCard' },
    { id: 'expenses-debt-cash-plus', name: 'Cash Card - UOB Cash Plus', type: 'expense', parentCategoryId: 'expenses-debt', monthlyBudgets: fillYear(1525), icon: 'Wallet' },

];


export const DEFAULT_ACCOUNTS: Account[] = [
    { id: 'acc-1', name: 'Cash', balance: 5000 },
    { id: 'acc-2', name: 'Main Bank Account', balance: 75000 },
    { id: 'acc-3', name: 'Credit Card', balance: -5000 },
];

export const DEFAULT_CREDIT_CARDS: CreditCard[] = [
    {
        id: 'cc-1',
        name: 'UOB Premier',
        issuer: 'UOB',
        last4: '1234',
        statementDate: 20,
        dueDate: 5,
        creditLimit: 150000,
        currentBalance: 25800,
        cardType: 'Mastercard',
        color: '#263238', // Dark grey/blue
        benefits: [
            { id: 'b1-1', description: 'Priority Pass Airport Lounge Access (2 times/year)', category: 'Travel', used: false },
            { id: 'b1-2', description: 'Complimentary Grab ride to/from airport (Code: UOBPREMIER)', category: 'Travel', used: true },
            { id: 'b1-3', description: 'Travel Insurance up to 20M THB', category: 'Travel', used: false },
            { id: 'b1-4', description: '1-for-1 dining deals at selected restaurants', category: 'Dining', used: false },
            { id: 'b1-5', description: 'UNI$ to Miles Conversion (1:1)', category: 'Lifestyle', used: true },
        ]
    },
    {
        id: 'cc-2',
        name: 'UOB Cash Plus',
        issuer: 'UOB',
        last4: '5678',
        statementDate: 25,
        dueDate: 10,
        creditLimit: 50000,
        currentBalance: 18300,
        cardType: 'Visa',
        color: '#005f82', // UOB blue
        benefits: [
            { id: 'b2-1', description: 'Cash on Call - Transfer credit to your account', category: 'Finance', used: true },
            { id: 'b2-2', description: 'Flexible repayment plan up to 48 months', category: 'Finance', used: false },
            { id: 'b2-3', description: 'No annual fee', category: 'Finance', used: true },
            { id: 'b2-4', description: 'Cash withdrawal from any ATM', category: 'Finance', used: false },
        ]
    },
];

export const DEFAULT_CONTACTS: Contact[] = [
    // --- 4-Generation Family Tree (Tier 1) ---
    { id: 'c-ggp1', firstName: 'George', lastName: 'Doe', relationship: 'Family', group: 'Doe Family', spouseId: 'c-ggm1', occupation: 'Retired Farmer', closeness: 1, status: 'Deceased' },
    { id: 'c-ggm1', firstName: 'Susan', lastName: 'Doe', relationship: 'Family', group: 'Doe Family', spouseId: 'c-ggp1', occupation: 'Retired Teacher', closeness: 1, status: 'Active' },
    { id: 'c-gp1', firstName: 'Richard', lastName: 'Doe', relationship: 'Family', group: 'Doe Family', parents: ['c-ggp1', 'c-ggm1'], spouseId: 'c-gm1', occupation: 'Retired Engineer', closeness: 1, status: 'Active' },
    { id: 'c-gm1', firstName: 'Mary', lastName: 'Doe', relationship: 'Family', group: 'Doe Family', spouseId: 'c-gp1', occupation: 'Retired Nurse', closeness: 1, status: 'Active' },
    { id: 'c1', firstName: 'John', lastName: 'Doe', photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg', relationship: 'Family', group: 'Doe Family', birthday: '1965-05-20', connections: ['c2', 'c3'], occupation: 'Architect', firstMet: '1990-01-15', socials: { linkedin: 'https://linkedin.com' }, spouseId: 'c2', parents: ['c-gp1', 'c-gm1'], closeness: 1, status: 'Active' },
    { id: 'c2', firstName: 'Jane', lastName: 'Doe', photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg', relationship: 'Family', group: 'Doe Family', birthday: '1968-11-12', connections: ['c1', 'c3'], occupation: 'Doctor', firstMet: '1990-01-15', socials: { facebook: 'https://facebook.com' }, spouseId: 'c1', closeness: 1, status: 'Active' },
    { id: 'c3', firstName: 'Peter', lastName: 'Doe', isUser: true, photoUrl: 'https://randomuser.me/api/portraits/men/33.jpg', relationship: 'Family', group: 'Doe Family', birthday: '1996-02-25', connections: ['c1', 'c2', 'c4'], occupation: 'You', firstMet: '1996-02-25', socials: {}, parents: ['c1', 'c2'], closeness: 1, status: 'Active' },

    // --- Friends (Tier 1 & 2) ---
    { id: 'c4', firstName: 'Alice', lastName: 'Smith', photoUrl: 'https://randomuser.me/api/portraits/women/50.jpg', relationship: 'Close Friend', group: 'University Squad', birthday: '1996-07-30', connections: ['c5', 'c6'], occupation: 'Graphic Designer', firstMet: '2015-08-20', socials: { instagram: 'https://instagram.com', twitter: 'https://twitter.com' }, closeness: 1, status: 'Active' },
    { id: 'c7', firstName: 'Diana', lastName: 'Prince', photoUrl: 'https://randomuser.me/api/portraits/women/51.jpg', relationship: 'Close Friend', group: 'Physics Study Group', birthday: '1995-03-22', connections: ['c4'], occupation: 'Curator', firstMet: '2018-01-01', socials: { instagram: 'https://instagram.com' }, closeness: 1, status: 'Active' },
    { id: 'c5', firstName: 'Bob', lastName: 'Johnson', photoUrl: 'https://randomuser.me/api/portraits/men/50.jpg', relationship: 'University Friend', group: 'University Squad', birthday: '1995-09-05', connections: ['c4', 'c6'], occupation: 'Software Engineer', firstMet: '2015-08-20', socials: { linkedin: 'https://linkedin.com' }, closeness: 2, status: 'Active' },
    { id: 'c6', firstName: 'Charlie', lastName: 'Brown', photoUrl: 'https://randomuser.me/api/portraits/men/51.jpg', relationship: 'University Friend', group: 'University Squad', birthday: '1997-01-15', connections: ['c4', 'c5'], occupation: 'Musician', firstMet: '2016-03-10', socials: {}, closeness: 2, status: 'Lost Contact' },

    // --- Work & Acquaintances (Tiers 3, 4, 5) ---
    { id: 'c8', firstName: 'Edward', lastName: 'King', photoUrl: 'https://randomuser.me/api/portraits/men/60.jpg', relationship: 'Colleague', group: 'Chemistry Club', birthday: '1980-06-10', connections: ['c9', 'c10'], occupation: 'Project Manager', firstMet: '2020-02-01', socials: { linkedin: 'https://linkedin.com' }, closeness: 3, status: 'Active' },
    { id: 'c9', firstName: 'Fiona', lastName: 'Queen', photoUrl: 'https://randomuser.me/api/portraits/women/60.jpg', relationship: 'Colleague', group: 'Chemistry Club', birthday: '1985-08-19', connections: ['c8', 'c10', 'c11'], occupation: 'HR Director', firstMet: '2019-11-15', socials: { linkedin: 'https://linkedin.com' }, closeness: 3, status: 'Active' },
    { id: 'c10', firstName: 'George', lastName: 'Duke', photoUrl: 'https://randomuser.me/api/portraits/men/61.jpg', relationship: 'Colleague', group: 'Genetics Lab', birthday: '1990-10-01', connections: ['c8', 'c9'], occupation: 'Marketing Lead', firstMet: '2021-06-01', socials: { twitter: 'https://twitter.com' }, closeness: 4, status: 'Active' },
    { id: 'c11', firstName: 'Hannah', lastName: 'Baron', photoUrl: 'https://randomuser.me/api/portraits/women/61.jpg', relationship: 'Colleague', group: 'Genetics Lab', birthday: '1992-12-05', connections: ['c9'], occupation: 'Accountant', firstMet: '2022-01-10', socials: {}, closeness: 4, status: 'Active' },
    { id: 'c12', firstName: 'Ivy', lastName: 'Green', photoUrl: 'https://randomuser.me/api/portraits/women/70.jpg', relationship: 'Other', group: 'Physics Study Group', birthday: '1988-04-18', occupation: 'Botanist', firstMet: '2023-04-22', socials: {}, closeness: 5, status: 'Active' },
    { id: 'c13', firstName: 'Jack', lastName: 'Black', photoUrl: 'https://randomuser.me/api/portraits/men/70.jpg', relationship: 'Other', birthday: '1979-09-01', occupation: 'Mechanic', firstMet: '2021-09-01', socials: {}, closeness: 5, status: 'Active' },
    { id: 'c14', firstName: 'Karen', lastName: 'White', photoUrl: 'https://randomuser.me/api/portraits/women/71.jpg', relationship: 'Other', connections: ['c11'], group: 'Solar Energy Project', occupation: 'Barista', firstMet: '2023-01-05', socials: { instagram: 'https://instagram.com' }, closeness: 5, status: 'Active' },
    
    // --- Tiers 5 & 6 ---
    { id: 'c15', firstName: 'Leo', lastName: 'Red', photoUrl: 'https://randomuser.me/api/portraits/men/71.jpg', relationship: 'Other', connections: ['c6'], group: 'Solar Energy Project', occupation: 'Artist', firstMet: '2022-07-19', socials: {}, closeness: 5, status: 'Active' },
    { id: 'c16', firstName: 'Negative', lastName: 'Nancy', relationship: 'Other', group: 'Blacklist', occupation: 'Critic', closeness: 6, status: 'Archived' },
];


export const SUBSCRIPTION_CATEGORIES = [
  'AI', 'APIs', 'Accounting', 'Advertising', 'Analytics', 'Art', 'Audio', 'Banking', 'Beauty', 'Blogging', 
  'Books', 'CMS', 'CRM', 'Clothing', 'Cloud Storage', 'Communication', 'Community', 'Content', 
  'Coworking', 'Cryptocurrency', 'Customer Support', 'Dating', 'Delivery', 'Design', 'Dev Tools', 
  'Domain Name', 'Donation', 'Education', 'Email', 'Email Marketing', 'Entertainment', 'Events', 
  'Fashion', 'Finance', 'Fitness', 'Food', 'Fundraising', 'Gaming', 'Hardware', 'Health & Wellness', 
  'Hosting', 'Insurance', 'Investing', 'Kids', 'Legal', 'Marketing', 'Medical', 'Monitoring', 'Music', 
  'Music Streaming', 'News', 'Online Payments', 'Open Source', 'Other', 'Pets', 'Photography', 
  'Podcasting', 'Productivity', 'Real Estate', 'Recruiting', 'SEO', 'SaaS', 'Sales', 'Security & Privacy', 
  'Shopping', 'Social Media', 'Software', 'Streaming', 'Task Management', 'Transportation', 'Travel', 
  'Utilities', 'VPN', 'Video', 'Video Streaming', 'WP Plugin', 'Web Builder', 'Writing', 'eCommerce'
];

export const DEFAULT_SUBSCRIPTIONS: Subscription[] = [
  { 
    id: 1, 
    name: 'Netflix', 
    category: 'Entertainment', 
    price: 105, 
    expenseType: 'Recurring',
    billingPeriod: 'Monthly', 
    billingDay: 19,
    firstPayment: '2025-12-19',
    endDate: '',
    paymentMethod: 'Credit Card', 
    website: 'https://netflix.com', 
    status: 'Active', 
    logoUrl: 'https://thumbs.dreamstime.com/b/logo-icon-vector-logos-logo-icons-set-social-media-flat-banner-vectors-svg-eps-jpg-jpeg-emblem-wallpaper-background-editorial-208329597.jpg',
    email: 'user@example.com',
    signupMethod: 'Google',
    signupIdentifier: 'user@gmail.com',
    usage: 'High'
  },
  { 
    id: 2, 
    name: 'Spotify', 
    category: 'Music', 
    price: 42, 
    expenseType: 'Recurring', 
    billingPeriod: 'Monthly', 
    billingDay: 14,
    firstPayment: '2025-12-14',
    endDate: '',
    paymentMethod: 'Credit Card', 
    website: 'https://spotify.com', 
    status: 'Active', 
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png',
    usage: 'High'
  },
  { 
    id: 3, 
    name: 'Youtube', 
    category: 'Entertainment', 
    price: 90, 
    expenseType: 'Recurring', 
    billingPeriod: 'Monthly', 
    billingDay: 9,
    firstPayment: '2025-12-09',
    endDate: '',
    paymentMethod: 'Credit Card', 
    website: 'https://youtube.com', 
    status: 'Active', 
    logoUrl: 'https://static.vecteezy.com/system/resources/previews/023/986/704/non_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png',
    usage: 'Medium'
  },
  { 
    id: 4, 
    name: 'iCloud', 
    category: 'Cloud Storage', 
    price: 200, 
    expenseType: 'Recurring', 
    billingPeriod: 'Monthly', 
    billingDay: 30, 
    firstPayment: '2025-12-30',
    endDate: '',
    paymentMethod: 'Credit Card', 
    website: 'https://icloud.com', 
    status: 'Active', 
    logoUrl: 'https://images.seeklogo.com/logo-png/42/2/apple-icloud-logo-png_seeklogo-426388.png',
    usage: 'High'
  },
  { 
    id: 5, 
    name: 'ChatGPT', 
    category: 'Productivity', 
    price: 699, 
    expenseType: 'Recurring', 
    billingPeriod: 'Monthly', 
    billingDay: 1, 
    firstPayment: '2025-12-01',
    endDate: '',
    paymentMethod: 'Credit Card', 
    website: 'https://openai.com', 
    status: 'Active', 
    logoUrl: 'https://static.vecteezy.com/system/resources/previews/021/059/827/non_2x/chatgpt-logo-chat-gpt-icon-on-white-background-free-vector.jpg',
    usage: 'High'
  },
  { 
    id: 6, 
    name: 'Gemini', 
    category: 'Productivity', 
    price: 750, 
    expenseType: 'Recurring', 
    billingPeriod: 'Monthly', 
    billingDay: 12,
    firstPayment: '2025-12-12',
    endDate: '',
    paymentMethod: 'Credit Card', 
    website: 'https://gemini.google.com', 
    status: 'Active', 
    logoUrl: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Gemini_SparkIcon_.width-500.format-webp.webp',
    usage: 'Medium'
  },
  { 
    id: 7, 
    name: 'Google One', 
    category: 'Cloud Storage', 
    price: 700, 
    expenseType: 'Recurring', 
    billingPeriod: 'Yearly', 
    billingDay: 1,
    firstPayment: '2025-01-01',
    endDate: '',
    paymentMethod: 'Credit Card', 
    website: 'https://one.google.com', 
    status: 'Active', 
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC6y-z48p4vusj2esmZvTrkIitP3EURPBhNw&s',
    usage: 'High'
  },
  {
    id: 8,
    name: 'Duolingo',
    category: 'Education',
    price: 1100,
    expenseType: 'Recurring',
    billingPeriod: 'Yearly',
    billingDay: 16,
    firstPayment: '2025-02-16', 
    endDate: '2026-02-16', 
    paymentMethod: 'Credit Card',
    website: 'https://duolingo.com',
    status: 'Inactive', 
    logoUrl: 'https://brandlogos.net/wp-content/uploads/2023/09/duolingo_icon-logo_brandlogos.net_aru6q-512x512.png',
    usage: 'Unused'
  },
  {
    id: 9,
    name: 'MeowGold',
    category: 'Finance', 
    price: 799,
    expenseType: 'Recurring',
    billingPeriod: 'Yearly',
    billingDay: 24,
    firstPayment: '2025-11-24',
    endDate: '',
    paymentMethod: 'Credit Card',
    website: '',
    status: 'Active',
    logoUrl: 'https://play-lh.googleusercontent.com/GvLMQymwZ6JDsvTJLy6dMq52BKxefbU1TcXCBZYxLt31jopl4rgtiNJEHvOJqTps6JI',
    usage: 'Low'
  },
  {
    id: 10,
    name: 'MuscleWiki',
    category: 'Health & Wellness',
    price: 699,
    expenseType: 'Recurring',
    billingPeriod: 'Yearly',
    billingDay: 18,
    firstPayment: '2025-01-18', 
    endDate: '2026-01-18', 
    paymentMethod: 'Credit Card',
    website: 'https://musclewiki.com',
    status: 'Inactive',
    logoUrl: 'https://yt3.googleusercontent.com/erXvfFlW_lp2KzkvHi4i9a-oJNmCqJFJLqLiTbRwEbkorAD-LLANbyEZ8k7N47aHWf-F6EbJ=s900-c-k-c0x00ffffff-no-rj',
    usage: 'Unused'
  },
  {
    id: 11,
    name: 'Wanderlog',
    category: 'Travel',
    price: 1190,
    expenseType: 'Recurring',
    billingPeriod: 'Yearly',
    billingDay: 26,
    firstPayment: '2025-11-26', 
    endDate: '2026-11-26', 
    paymentMethod: 'Credit Card',
    website: 'https://wanderlog.com',
    status: 'Inactive',
    logoUrl: 'https://bookface-images.s3.amazonaws.com/small_logos/9904ae948c8e0e97d71028dcbca777328465de82.png',
    usage: 'Unused'
  },
  {
    id: 12,
    name: 'Higgsfield AI',
    category: 'AI',
    price: 1750,
    expenseType: 'Recurring',
    billingPeriod: 'Monthly',
    billingDay: 17,
    firstPayment: '2026-01-17',
    endDate: '',
    paymentMethod: 'Credit Card',
    website: 'https://higgsfield.ai',
    status: 'Active',
    logoUrl: 'https://avatars.githubusercontent.com/u/146205480?s=200&v=4',
    usage: 'Low'
  },
  {
    id: 13,
    name: '1Password',
    category: 'Security & Privacy',
    price: 99,
    expenseType: 'Recurring',
    billingPeriod: 'Monthly',
    billingDay: 25,
    firstPayment: '2025-12-25',
    endDate: '',
    paymentMethod: 'Credit Card',
    website: 'https://1password.com',
    status: 'Active',
    logoUrl: 'https://amused-moccasin-deinefybja.edgeone.app/Format=Glyph.png',
    usage: 'High'
  }
];