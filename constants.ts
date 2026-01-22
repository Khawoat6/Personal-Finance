
import type { Category, Account, Subscription } from './types';

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
    signupIdentifier: 'user@gmail.com'
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
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png' 
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
    logoUrl: 'https://static.vecteezy.com/system/resources/previews/023/986/704/non_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png' 
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
    logoUrl: 'https://images.seeklogo.com/logo-png/42/2/apple-icloud-logo-png_seeklogo-426388.png' 
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
    logoUrl: 'https://static.vecteezy.com/system/resources/previews/021/059/827/non_2x/chatgpt-logo-chat-gpt-icon-on-white-background-free-vector.jpg' 
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
    logoUrl: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Gemini_SparkIcon_.width-500.format-webp.webp' 
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
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC6y-z48p4vusj2esmZvTrkIitP3EURPBhNw&s' 
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
    logoUrl: 'https://brandlogos.net/wp-content/uploads/2023/09/duolingo_icon-logo_brandlogos.net_aru6q-512x512.png'
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
    logoUrl: 'https://play-lh.googleusercontent.com/GvLMQymwZ6JDsvTJLy6dMq52BKxefbU1TcXCBZYxLt31jopl4rgtiNJEHvOJqTps6JI'
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
    logoUrl: 'https://yt3.googleusercontent.com/erXvfFlW_lp2KzkvHi4i9a-oJNmCqJFJLqLiTbRwEbkorAD-LLANbyEZ8k7N47aHWf-F6EbJ=s900-c-k-c0x00ffffff-no-rj'
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
    logoUrl: 'https://bookface-images.s3.amazonaws.com/small_logos/9904ae948c8e0e97d71028dcbca777328465de82.png'
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
    logoUrl: 'https://avatars.githubusercontent.com/u/146205480?s=200&v=4'
  }
];