import { atom } from "jotai";

export type CardColor = "violet" | "blue" | "rose" | "emerald" | "amber";

export type CardEntity = {
  id: string;
  name: string;
  type: "credit" | "debit";
  currency: string;
  last4: string;
  expiry: string;
  color: CardColor;
  limit?: number;
  spent?: number;
};

export type Account = {
  id: string;
  name: string;
  institution: string;
  currency: string;
  balance: number;
};

export type Market = {
  id: string;
  name: string;
  currency: string;
  icon: string;
};

export type Portfolio = {
  id: string;
  marketId: string;
  name: string;
  totalValue: number;
  icon: string;
};

export type Stock = {
  id: string;
  portfolioId: string;
  ticker: string;
  name: string;
  value: number;
  avgBuyValue: number;
};

export type HistoryPoint = { month: string; value: number };

export type ExpenseCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type MonthlyBalance = {
  id: string;
  accountId: string;
  month: string;
  opening: number;
  closing: number;
};

export type ExpenseEntry = {
  id: string;
  accountId: string;
  month: string;
  categoryId: string;
  amount: number;
  note?: string;
};

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type NotificationKind =
  | "transaction"
  | "security"
  | "system"
  | "insight"
  | "reminder"
  | "goal";
export type NotificationSeverity = "info" | "success" | "warning" | "danger";

export type Notification = {
  id: string;
  kind: NotificationKind;
  severity: NotificationSeverity;
  title: string;
  body: string;
  dateISO: string;
  read: boolean;
  href?: string;
};

export type AssetKind =
  | "residential"
  | "commercial"
  | "land"
  | "car"
  | "gold"
  | "other";

export type Asset = {
  id: string;
  name: string;
  kind: AssetKind;
  currency: string;
  value: number;
  appreciating: boolean;
  note?: string;
};

export type PriceMode = "exact" | "approx";

export type AssetValuation = {
  id: string;
  assetId: string;
  dateISO: string;
  value: number;
  mode: PriceMode;
  tolerance?: number;
  note?: string;
};

export type Transaction = {
  id: string;
  payee: string;
  payeeIcon: string;
  dateISO: string;
  method: string;
  type: "Send" | "Receive";
  status: "Pending" | "Complete" | "Failed";
  amount: number;
};

export type FlowNodeKind =
  | "income"
  | "account"
  | "expense"
  | "savings"
  | "transform";

export type FlowNodeData = {
  kind: FlowNodeKind;
  label: string;
  amount: number;
  currency: string;
  note?: string;
};

export type WorkflowNode = {
  id: string;
  type: "flow";
  position: { x: number; y: number };
  data: FlowNodeData;
};

export type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type AllocationBucket = {
  id: string;
  label: string;
  pct: number;
  color: string;
};

export type SeriesPoint = {
  month: string;
  movable: number;
  nonMovable: number;
};

export type LoanKind =
  | "home"
  | "car"
  | "personal"
  | "education"
  | "credit"
  | "business"
  | "other";

export type Loan = {
  id: string;
  name: string;
  lender: string;
  kind: LoanKind;
  currency: string;
  principal: number;
  balance: number;
  rate: number;
  emi: number;
  tenureMonths: number;
  startMonth?: string;
  active: boolean;
  note?: string;
};

export type IncomeKind =
  | "salary"
  | "freelance"
  | "business"
  | "rental"
  | "dividend"
  | "interest"
  | "other";

export type IncomeSource = {
  id: string;
  name: string;
  kind: IncomeKind;
  currency: string;
  amount: number;
  cadence: "monthly" | "yearly" | "one-time";
  active: boolean;
  note?: string;
};

export type IncomeReceipt = {
  id: string;
  sourceId: string;
  dateISO: string;
  amount: number;
  note?: string;
};

export const cardsAtom = atom<CardEntity[]>([
  {
    id: "c1",
    name: "Visa Platinum",
    type: "credit",
    currency: "INR",
    last4: "9213",
    expiry: "06/28",
    color: "violet",
    limit: 500_000,
    spent: 124_000,
  },
  {
    id: "c2",
    name: "Salary debit",
    type: "debit",
    currency: "INR",
    last4: "8102",
    expiry: "04/29",
    color: "blue",
  },
  {
    id: "c3",
    name: "Travel card",
    type: "credit",
    currency: "USD",
    last4: "0421",
    expiry: "02/30",
    color: "rose",
    limit: 8_000,
    spent: 1_240,
  },
]);

export const accountsAtom = atom<Account[]>([]);

export const expenseCategoriesAtom = atom<ExpenseCategory[]>([
  { id: "cat-groceries", name: "Groceries", icon: "cart", color: "#FCD7B6" },
  { id: "cat-rent", name: "Rent", icon: "house", color: "#CFE6F0" },
  { id: "cat-utilities", name: "Utilities", icon: "bolt", color: "#D9D6F2" },
  { id: "cat-dining", name: "Dining", icon: "fork", color: "#F4D4DA" },
  { id: "cat-transport", name: "Transport", icon: "car", color: "#CDE9D0" },
  { id: "cat-other", name: "Other", icon: "dots", color: "#EAD9F4" },
]);

export const monthlyBalancesAtom = atom<MonthlyBalance[]>([
  {
    id: "mb-a1-jul",
    accountId: "a1",
    month: "Jul",
    opening: 240_000,
    closing: 260_000,
  },
  {
    id: "mb-a1-aug",
    accountId: "a1",
    month: "Aug",
    opening: 260_000,
    closing: 250_000,
  },
  {
    id: "mb-a1-sep",
    accountId: "a1",
    month: "Sep",
    opening: 250_000,
    closing: 270_000,
  },
  {
    id: "mb-a1-oct",
    accountId: "a1",
    month: "Oct",
    opening: 270_000,
    closing: 265_000,
  },
  {
    id: "mb-a1-nov",
    accountId: "a1",
    month: "Nov",
    opening: 265_000,
    closing: 280_000,
  },
  {
    id: "mb-a1-dec",
    accountId: "a1",
    month: "Dec",
    opening: 280_000,
    closing: 285_000,
  },

  {
    id: "mb-a2-jul",
    accountId: "a2",
    month: "Jul",
    opening: 1_150_000,
    closing: 1_180_000,
  },
  {
    id: "mb-a2-aug",
    accountId: "a2",
    month: "Aug",
    opening: 1_180_000,
    closing: 1_200_000,
  },
  {
    id: "mb-a2-sep",
    accountId: "a2",
    month: "Sep",
    opening: 1_200_000,
    closing: 1_210_000,
  },
  {
    id: "mb-a2-oct",
    accountId: "a2",
    month: "Oct",
    opening: 1_210_000,
    closing: 1_225_000,
  },
  {
    id: "mb-a2-nov",
    accountId: "a2",
    month: "Nov",
    opening: 1_225_000,
    closing: 1_235_000,
  },
  {
    id: "mb-a2-dec",
    accountId: "a2",
    month: "Dec",
    opening: 1_235_000,
    closing: 1_240_000,
  },

  {
    id: "mb-a3-jul",
    accountId: "a3",
    month: "Jul",
    opening: 580_000,
    closing: 590_000,
  },
  {
    id: "mb-a3-aug",
    accountId: "a3",
    month: "Aug",
    opening: 590_000,
    closing: 595_000,
  },
  {
    id: "mb-a3-sep",
    accountId: "a3",
    month: "Sep",
    opening: 595_000,
    closing: 595_000,
  },
  {
    id: "mb-a3-oct",
    accountId: "a3",
    month: "Oct",
    opening: 595_000,
    closing: 598_000,
  },
  {
    id: "mb-a3-nov",
    accountId: "a3",
    month: "Nov",
    opening: 598_000,
    closing: 600_000,
  },
  {
    id: "mb-a3-dec",
    accountId: "a3",
    month: "Dec",
    opening: 600_000,
    closing: 600_000,
  },
]);

export const expenseEntriesAtom = atom<ExpenseEntry[]>([
  {
    id: "e1",
    accountId: "a1",
    month: "Aug",
    categoryId: "cat-groceries",
    amount: 4000,
  },
  {
    id: "e2",
    accountId: "a1",
    month: "Aug",
    categoryId: "cat-dining",
    amount: 3000,
  },
  {
    id: "e3",
    accountId: "a1",
    month: "Aug",
    categoryId: "cat-other",
    amount: 3000,
  },
  {
    id: "e4",
    accountId: "a1",
    month: "Oct",
    categoryId: "cat-utilities",
    amount: 5000,
  },
]);

export const marketsAtom = atom<Market[]>([
  { id: "m1", name: "US Equity", currency: "USD", icon: "chart" },
  { id: "m2", name: "Indian Equity", currency: "INR", icon: "bank" },
]);

export const portfoliosAtom = atom<Portfolio[]>([
  {
    id: "p1",
    marketId: "m1",
    name: "Tech",
    totalValue: 50_000,
    icon: "rocket",
  },
  {
    id: "p2",
    marketId: "m1",
    name: "Long term",
    totalValue: 25_000,
    icon: "shield",
  },
  {
    id: "p3",
    marketId: "m2",
    name: "Bluechips",
    totalValue: 2_000_000,
    icon: "star",
  },
]);

export const stocksAtom = atom<Stock[]>([
  {
    id: "s1",
    portfolioId: "p1",
    ticker: "AAPL",
    name: "Apple",
    value: 25_000,
    avgBuyValue: 20_000,
  },
  {
    id: "s2",
    portfolioId: "p1",
    ticker: "MSFT",
    name: "Microsoft",
    value: 15_000,
    avgBuyValue: 16_500,
  },
  {
    id: "s3",
    portfolioId: "p2",
    ticker: "NVDA",
    name: "NVIDIA",
    value: 10_000,
    avgBuyValue: 4_200,
  },
  {
    id: "s4",
    portfolioId: "p3",
    ticker: "INFY",
    name: "Infosys",
    value: 1_500_000,
    avgBuyValue: 1_200_000,
  },
]);

export const stocksHistoryAtom = atom<HistoryPoint[]>([
  { month: "Jan", value: 1_750_000 },
  { month: "Feb", value: 1_790_000 },
  { month: "Mar", value: 1_820_000 },
  { month: "Apr", value: 1_860_000 },
  { month: "May", value: 1_900_000 },
  { month: "Jun", value: 1_945_000 },
  { month: "Jul", value: 1_980_000 },
  { month: "Aug", value: 2_010_000 },
  { month: "Sep", value: 2_040_000 },
  { month: "Oct", value: 2_055_000 },
  { month: "Nov", value: 2_065_000 },
  { month: "Dec", value: 2_075_000 },
]);

export const assetsAtom = atom<Asset[]>([
  {
    id: "as1",
    name: "Bandra Apartment",
    kind: "residential",
    currency: "INR",
    value: 32_500_000,
    appreciating: true,
    note: "Mumbai",
  },
  {
    id: "as2",
    name: "Andheri Office",
    kind: "commercial",
    currency: "INR",
    value: 18_200_000,
    appreciating: true,
    note: "Mumbai",
  },
  {
    id: "as3",
    name: "Goa Plot",
    kind: "land",
    currency: "INR",
    value: 8_750_000,
    appreciating: true,
    note: "Goa",
  },
  {
    id: "as4",
    name: "Honda City",
    kind: "car",
    currency: "INR",
    value: 1_200_000,
    appreciating: false,
  },
  {
    id: "as5",
    name: "Wedding Jewelry",
    kind: "gold",
    currency: "INR",
    value: 4_500_000,
    appreciating: true,
  },
]);

export const assetValuationsAtom = atom<AssetValuation[]>([
  {
    id: "av-as1-1",
    assetId: "as1",
    dateISO: "2024-05-01",
    value: 28_000_000,
    mode: "approx",
    tolerance: 800_000,
    note: "Broker estimate",
  },
  {
    id: "av-as1-2",
    assetId: "as1",
    dateISO: "2025-05-01",
    value: 30_500_000,
    mode: "approx",
    tolerance: 600_000,
  },
  {
    id: "av-as1-3",
    assetId: "as1",
    dateISO: "2026-05-01",
    value: 32_500_000,
    mode: "approx",
    tolerance: 500_000,
  },

  {
    id: "av-as2-1",
    assetId: "as2",
    dateISO: "2025-01-15",
    value: 17_400_000,
    mode: "approx",
    tolerance: 400_000,
  },
  {
    id: "av-as2-2",
    assetId: "as2",
    dateISO: "2026-01-15",
    value: 18_200_000,
    mode: "approx",
    tolerance: 400_000,
  },

  {
    id: "av-as3-1",
    assetId: "as3",
    dateISO: "2024-12-01",
    value: 8_000_000,
    mode: "exact",
  },
  {
    id: "av-as3-2",
    assetId: "as3",
    dateISO: "2026-02-01",
    value: 8_750_000,
    mode: "approx",
    tolerance: 300_000,
  },

  {
    id: "av-as4-1",
    assetId: "as4",
    dateISO: "2023-04-01",
    value: 1_650_000,
    mode: "exact",
  },
  {
    id: "av-as4-2",
    assetId: "as4",
    dateISO: "2024-04-01",
    value: 1_440_000,
    mode: "approx",
    tolerance: 60_000,
  },
  {
    id: "av-as4-3",
    assetId: "as4",
    dateISO: "2025-04-01",
    value: 1_300_000,
    mode: "approx",
    tolerance: 50_000,
  },
  {
    id: "av-as4-4",
    assetId: "as4",
    dateISO: "2026-04-01",
    value: 1_200_000,
    mode: "approx",
    tolerance: 40_000,
  },

  {
    id: "av-as5-1",
    assetId: "as5",
    dateISO: "2024-10-15",
    value: 3_800_000,
    mode: "approx",
    tolerance: 150_000,
  },
  {
    id: "av-as5-2",
    assetId: "as5",
    dateISO: "2025-10-15",
    value: 4_200_000,
    mode: "approx",
    tolerance: 150_000,
  },
  {
    id: "av-as5-3",
    assetId: "as5",
    dateISO: "2026-04-15",
    value: 4_500_000,
    mode: "approx",
    tolerance: 120_000,
  },
]);

export const transactionsAtom = atom<Transaction[]>([
  {
    id: "t1",
    payee: "Salary · Acme Corp",
    payeeIcon: "💼",
    dateISO: "2026-05-01T09:00:00",
    method: "HDFC **** 8102",
    type: "Receive",
    status: "Complete",
    amount: 285_000,
  },
  {
    id: "t2",
    payee: "Bandra rent",
    payeeIcon: "🏠",
    dateISO: "2026-05-05T10:30:00",
    method: "HDFC **** 8102",
    type: "Receive",
    status: "Complete",
    amount: 65_000,
  },
  {
    id: "t3",
    payee: "Home loan EMI",
    payeeIcon: "🏦",
    dateISO: "2026-05-05T07:00:00",
    method: "HDFC **** 8102",
    type: "Send",
    status: "Complete",
    amount: -158_000,
  },
  {
    id: "t4",
    payee: "Car loan EMI",
    payeeIcon: "🚗",
    dateISO: "2026-05-05T07:00:00",
    method: "ICICI **** 9213",
    type: "Send",
    status: "Complete",
    amount: -19_500,
  },
  {
    id: "t5",
    payee: "Amazon",
    payeeIcon: "📦",
    dateISO: "2026-05-10T18:45:00",
    method: "Visa **** 9213",
    type: "Send",
    status: "Complete",
    amount: -12_400,
  },
  {
    id: "t6",
    payee: "BigBasket",
    payeeIcon: "🥦",
    dateISO: "2026-05-11T08:15:00",
    method: "Salary **** 8102",
    type: "Send",
    status: "Complete",
    amount: -4_200,
  },
  {
    id: "t7",
    payee: "Swiggy",
    payeeIcon: "🍱",
    dateISO: "2026-05-12T20:30:00",
    method: "Visa **** 9213",
    type: "Send",
    status: "Complete",
    amount: -1_180,
  },
  {
    id: "t8",
    payee: "Electricity bill",
    payeeIcon: "⚡",
    dateISO: "2026-05-12T11:00:00",
    method: "Salary **** 8102",
    type: "Send",
    status: "Complete",
    amount: -3_400,
  },
  {
    id: "t9",
    payee: "Figma Pro",
    payeeIcon: "🎨",
    dateISO: "2026-05-13T08:01:00",
    method: "Travel **** 0421",
    type: "Send",
    status: "Pending",
    amount: -120,
  },
  {
    id: "t10",
    payee: "Youtube Premium",
    payeeIcon: "▶︎",
    dateISO: "2026-05-13T08:01:00",
    method: "Travel **** 0421",
    type: "Send",
    status: "Pending",
    amount: -159,
  },
  {
    id: "t11",
    payee: "Uber",
    payeeIcon: "🛵",
    dateISO: "2026-05-14T19:20:00",
    method: "Visa **** 9213",
    type: "Send",
    status: "Complete",
    amount: -480,
  },
  {
    id: "t12",
    payee: "Starbucks",
    payeeIcon: "☕",
    dateISO: "2026-05-14T09:10:00",
    method: "Visa **** 9213",
    type: "Send",
    status: "Complete",
    amount: -540,
  },
  {
    id: "t13",
    payee: "Design retainer",
    payeeIcon: "🧾",
    dateISO: "2026-04-15T14:00:00",
    method: "USD wire",
    type: "Receive",
    status: "Complete",
    amount: 2_500,
  },
  {
    id: "t14",
    payee: "Refund · Myntra",
    payeeIcon: "🛍️",
    dateISO: "2026-04-22T12:00:00",
    method: "Visa **** 9213",
    type: "Receive",
    status: "Complete",
    amount: 1_899,
  },
  {
    id: "t15",
    payee: "Failed: ATM Mumbai",
    payeeIcon: "🏧",
    dateISO: "2026-05-09T17:32:00",
    method: "Salary **** 8102",
    type: "Send",
    status: "Failed",
    amount: -5_000,
  },
  {
    id: "t16",
    payee: "Goa hotel hold",
    payeeIcon: "🏖️",
    dateISO: "2026-05-08T22:10:00",
    method: "Travel **** 0421",
    type: "Send",
    status: "Pending",
    amount: -18_500,
  },
]);

export const workflowNodesAtom = atom<WorkflowNode[]>([
  {
    id: "wf-1",
    type: "flow",
    position: { x: 20, y: 40 },
    data: {
      kind: "income",
      label: "Primary salary",
      amount: 280_000,
      currency: "INR",
    },
  },
  {
    id: "wf-2",
    type: "flow",
    position: { x: 20, y: 160 },
    data: {
      kind: "income",
      label: "Bandra rental",
      amount: 65_000,
      currency: "INR",
    },
  },
  {
    id: "wf-3",
    type: "flow",
    position: { x: 280, y: 100 },
    data: {
      kind: "account",
      label: "Checking",
      amount: 345_000,
      currency: "INR",
    },
  },
  {
    id: "wf-4",
    type: "flow",
    position: { x: 540, y: 0 },
    data: { kind: "expense", label: "Rent", amount: 85_000, currency: "INR" },
  },
  {
    id: "wf-5",
    type: "flow",
    position: { x: 540, y: 100 },
    data: {
      kind: "expense",
      label: "Groceries",
      amount: 20_000,
      currency: "INR",
    },
  },
  {
    id: "wf-6",
    type: "flow",
    position: { x: 540, y: 200 },
    data: {
      kind: "savings",
      label: "Emergency fund",
      amount: 100_000,
      currency: "INR",
    },
  },
  {
    id: "wf-7",
    type: "flow",
    position: { x: 540, y: 300 },
    data: {
      kind: "transform",
      label: "Investments",
      amount: 140_000,
      currency: "INR",
    },
  },
]);

export const workflowEdgesAtom = atom<WorkflowEdge[]>([
  { id: "we-1", source: "wf-1", target: "wf-3" },
  { id: "we-2", source: "wf-2", target: "wf-3" },
  { id: "we-3", source: "wf-3", target: "wf-4" },
  { id: "we-4", source: "wf-3", target: "wf-5" },
  { id: "we-5", source: "wf-3", target: "wf-6" },
  { id: "we-6", source: "wf-3", target: "wf-7" },
]);

export const allocationAtom = atom<AllocationBucket[]>([
  { id: "a1", label: "Emergency fund", pct: 46, color: "#FCD7B6" },
  { id: "a2", label: "BPJS", pct: 22, color: "#D9D6F2" },
  { id: "a3", label: "Pay rent", pct: 12, color: "#CFE6F0" },
  { id: "a4", label: "App subscription", pct: 11, color: "#EAD9F4" },
  { id: "a5", label: "Shopping", pct: 5, color: "#F4D4DA" },
  { id: "a6", label: "Others", pct: 4, color: "#CDE9D0" },
]);

export const netWorthSeriesAtom = atom<SeriesPoint[]>([
  { month: "Jan", movable: 3200, nonMovable: 2200 },
  { month: "Feb", movable: 3500, nonMovable: 2300 },
  { month: "Mar", movable: 3300, nonMovable: 2400 },
  { month: "Apr", movable: 4100, nonMovable: 2500 },
  { month: "May", movable: 4400, nonMovable: 2700 },
  { month: "Jun", movable: 4200, nonMovable: 2900 },
  { month: "Jul", movable: 4800, nonMovable: 3000 },
  { month: "Aug", movable: 4600, nonMovable: 3100 },
  { month: "Sep", movable: 5100, nonMovable: 3200 },
  { month: "Oct", movable: 4900, nonMovable: 3300 },
  { month: "Nov", movable: 5300, nonMovable: 3500 },
  { month: "Dec", movable: 5500, nonMovable: 3600 },
]);

export const notificationsAtom = atom<Notification[]>([
  {
    id: "n1",
    kind: "transaction",
    severity: "info",
    title: "Large debit on Checking",
    body: "₹124,000 spent on Visa Platinum at Amazon.",
    dateISO: "2026-05-15T09:24:00",
    read: false,
    href: "/cards",
  },
  {
    id: "n2",
    kind: "security",
    severity: "warning",
    title: "New device sign-in",
    body: "A new browser signed in from Mumbai, IN.",
    dateISO: "2026-05-14T22:10:00",
    read: false,
  },
  {
    id: "n3",
    kind: "reminder",
    severity: "warning",
    title: "Home loan EMI due in 3 days",
    body: "HDFC home loan · ₹158,000 on May 18.",
    dateISO: "2026-05-15T07:00:00",
    read: false,
    href: "/loans/l1",
  },
  {
    id: "n4",
    kind: "insight",
    severity: "success",
    title: "Dining spend down 22%",
    body: "You spent less on dining in April vs March.",
    dateISO: "2026-05-13T18:42:00",
    read: true,
  },
  {
    id: "n5",
    kind: "goal",
    severity: "success",
    title: "Holiday goal at 87%",
    body: "You’re ₹38k away from your target.",
    dateISO: "2026-05-12T11:08:00",
    read: true,
  },
  {
    id: "n6",
    kind: "system",
    severity: "info",
    title: "Backup completed",
    body: "Your portfolio data was backed up locally.",
    dateISO: "2026-05-11T03:00:00",
    read: true,
  },
  {
    id: "n7",
    kind: "transaction",
    severity: "danger",
    title: "Card declined",
    body: "Travel card ending 0421 was declined.",
    dateISO: "2026-05-10T14:01:00",
    read: false,
    href: "/cards",
  },
  {
    id: "n8",
    kind: "reminder",
    severity: "info",
    title: "Update salary income",
    body: "Your monthly salary entry needs a refresh.",
    dateISO: "2026-05-09T08:30:00",
    read: true,
    href: "/income-sources",
  },
  {
    id: "n9",
    kind: "insight",
    severity: "info",
    title: "Net worth up 1.8% MoM",
    body: "Movable assets drove most of the gain.",
    dateISO: "2026-05-08T09:00:00",
    read: true,
  },
  {
    id: "n10",
    kind: "security",
    severity: "danger",
    title: "Password expires soon",
    body: "Change your password within 7 days.",
    dateISO: "2026-05-07T19:45:00",
    read: false,
  },
]);

export const unreadNotificationsAtom = atom((g) =>
  g(notificationsAtom).filter((n) => !n.read),
);
export const unreadNotificationsCountAtom = atom(
  (g) => g(unreadNotificationsAtom).length,
);

export const loansAtom = atom<Loan[]>([
  {
    id: "l1",
    name: "Bandra home loan",
    lender: "HDFC",
    kind: "home",
    currency: "INR",
    principal: 18_000_000,
    balance: 12_400_000,
    rate: 8.6,
    emi: 158_000,
    tenureMonths: 240,
    startMonth: "Jan",
    active: true,
    note: "20-yr tenure",
  },
  {
    id: "l2",
    name: "Honda City auto",
    lender: "ICICI",
    kind: "car",
    currency: "INR",
    principal: 900_000,
    balance: 320_000,
    rate: 9.2,
    emi: 19_500,
    tenureMonths: 60,
    startMonth: "Jun",
    active: true,
  },
  {
    id: "l3",
    name: "MBA loan",
    lender: "SBI",
    kind: "education",
    currency: "INR",
    principal: 1_500_000,
    balance: 0,
    rate: 10.5,
    emi: 24_000,
    tenureMonths: 84,
    active: false,
    note: "Closed",
  },
]);

export const incomeSourcesAtom = atom<IncomeSource[]>([
  {
    id: "inc1",
    name: "Primary salary",
    kind: "salary",
    currency: "INR",
    amount: 280_000,
    cadence: "monthly",
    active: true,
    note: "Acme Corp",
  },
  {
    id: "inc2",
    name: "Design retainer",
    kind: "freelance",
    currency: "USD",
    amount: 2_500,
    cadence: "monthly",
    active: true,
  },
  {
    id: "inc3",
    name: "Bandra rental",
    kind: "rental",
    currency: "INR",
    amount: 65_000,
    cadence: "monthly",
    active: true,
    note: "2BHK",
  },
  {
    id: "inc4",
    name: "FD interest",
    kind: "interest",
    currency: "INR",
    amount: 120_000,
    cadence: "yearly",
    active: true,
  },
  {
    id: "inc5",
    name: "Conference talk",
    kind: "freelance",
    currency: "USD",
    amount: 4_000,
    cadence: "one-time",
    active: true,
    note: "ReactConf 2026",
  },
]);

export const incomeReceiptsAtom = atom<IncomeReceipt[]>([
  { id: "ir-inc1-1", sourceId: "inc1", dateISO: "2025-12-01", amount: 280_000 },
  { id: "ir-inc1-2", sourceId: "inc1", dateISO: "2026-01-01", amount: 280_000 },
  { id: "ir-inc1-3", sourceId: "inc1", dateISO: "2026-02-01", amount: 280_000 },
  {
    id: "ir-inc1-4",
    sourceId: "inc1",
    dateISO: "2026-03-01",
    amount: 285_000,
    note: "Increment",
  },
  { id: "ir-inc1-5", sourceId: "inc1", dateISO: "2026-04-01", amount: 285_000 },
  { id: "ir-inc1-6", sourceId: "inc1", dateISO: "2026-05-01", amount: 285_000 },

  { id: "ir-inc2-1", sourceId: "inc2", dateISO: "2026-01-15", amount: 2_500 },
  { id: "ir-inc2-2", sourceId: "inc2", dateISO: "2026-02-15", amount: 2_500 },
  {
    id: "ir-inc2-3",
    sourceId: "inc2",
    dateISO: "2026-03-15",
    amount: 2_800,
    note: "Scope bump",
  },
  { id: "ir-inc2-4", sourceId: "inc2", dateISO: "2026-04-15", amount: 2_500 },

  { id: "ir-inc3-1", sourceId: "inc3", dateISO: "2026-01-05", amount: 65_000 },
  { id: "ir-inc3-2", sourceId: "inc3", dateISO: "2026-02-05", amount: 65_000 },
  { id: "ir-inc3-3", sourceId: "inc3", dateISO: "2026-03-05", amount: 65_000 },
  { id: "ir-inc3-4", sourceId: "inc3", dateISO: "2026-04-05", amount: 65_000 },
  { id: "ir-inc3-5", sourceId: "inc3", dateISO: "2026-05-05", amount: 65_000 },

  {
    id: "ir-inc4-1",
    sourceId: "inc4",
    dateISO: "2026-03-31",
    amount: 120_000,
    note: "Q4 FY25-26",
  },

  {
    id: "ir-inc5-1",
    sourceId: "inc5",
    dateISO: "2026-02-20",
    amount: 4_000,
    note: "ReactConf payout",
  },
]);

function monthlyAmount(s: IncomeSource): number {
  if (!s.active) return 0;
  if (s.cadence === "monthly") return s.amount;
  if (s.cadence === "yearly") return s.amount / 12;
  return 0;
}

export const monthlyIncomeTotalAtom = atom((g) =>
  g(incomeSourcesAtom).reduce((s, x) => s + monthlyAmount(x), 0),
);

export type ExpenseInsightSlice = {
  id: string;
  name: string;
  color: string;
  amount: number;
  pct: number;
};

export const latestExpenseMonthAtom = atom((g) => {
  const months = new Set(g(expenseEntriesAtom).map((e) => e.month));
  const ordered = MONTHS.filter((m) => months.has(m));
  return ordered[ordered.length - 1] ?? null;
});

export const monthlyExpenseInsightAtom = atom((g) => {
  const month = g(latestExpenseMonthAtom);
  if (!month)
    return {
      month: null as string | null,
      total: 0,
      slices: [] as ExpenseInsightSlice[],
    };
  const entries = g(expenseEntriesAtom).filter((e) => e.month === month);
  const cats = g(expenseCategoriesAtom);
  const totals = new Map<string, number>();
  for (const e of entries)
    totals.set(e.categoryId, (totals.get(e.categoryId) ?? 0) + e.amount);
  const total = [...totals.values()].reduce((a, b) => a + b, 0);
  const slices: ExpenseInsightSlice[] = [...totals.entries()]
    .map(([id, amount]) => {
      const cat = cats.find((c) => c.id === id);
      return {
        id,
        name: cat?.name ?? "Unknown",
        color: cat?.color ?? "#cccccc",
        amount,
        pct: total > 0 ? Math.round((amount / total) * 100) : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);
  return { month: month as string | null, total, slices };
});

export const accountTotalAtom = atom((g) =>
  g(accountsAtom).reduce((s, a) => s + a.balance, 0),
);
export const stockTotalAtom = atom((g) =>
  g(portfoliosAtom).reduce((s, p) => s + p.totalValue, 0),
);
export const assetTotalAtom = atom((g) =>
  g(assetsAtom).reduce((s, a) => s + a.value, 0),
);
export const loanTotalAtom = atom((g) =>
  g(loansAtom)
    .filter((l) => l.active)
    .reduce((s, l) => s + l.balance, 0),
);
export const monthlyEmiTotalAtom = atom((g) =>
  g(loansAtom)
    .filter((l) => l.active)
    .reduce((s, l) => s + l.emi, 0),
);
export const movableTotalAtom = atom(
  (g) => g(accountTotalAtom) + g(stockTotalAtom),
);
export const nonMovableTotalAtom = atom((g) => g(assetTotalAtom));
export const netWorthAtom = atom(
  (g) => g(movableTotalAtom) + g(nonMovableTotalAtom) - g(loanTotalAtom),
);
