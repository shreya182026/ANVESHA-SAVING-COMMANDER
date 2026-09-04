import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "./i18n";

export type Screen =
  | "splash" | "auth" | "otp" | "langloc" | "name" | "intro" | "tour" | "onboardingHub"
  | "personal" | "financial" | "whysave" | "goalsetup" | "upi" | "budget" | "app";

export type Tab = "home" | "money" | "goals" | "wallet" | "profile";
export type PortalStatus = "complete" | "inProgress" | "needsAttention" | "notStarted";

export type Overlay =
  | { kind: "none" }
  | { kind: "saveAction"; amount: number }
  | { kind: "withdraw" }
  | { kind: "help" }
  | { kind: "goalDetail"; id: string }
  | { kind: "addGoal" }
  | { kind: "privacy" }
  | { kind: "settings" }
  | { kind: "calendar" }
  | { kind: "schemes" }
  | { kind: "notifications" }
  | { kind: "reviews" }
  | { kind: "extraMoney" }
  | { kind: "buffer" }
  | { kind: "portalInfo"; portal: string }
  | { kind: "dailyCheckin" }
  | { kind: "budget" };

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  targetDate: string;
  status?: "active" | "paused" | "completed";
  contributionPreference?: number;
  planMode?: "anvesha" | "own" | "help";
}
export interface DailyRecord {
  date: string;
  entries: { id: string; income: number; expense: number; category?: string; note?: string }[];
}
export interface Txn {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  label: string;
  when: string;
  goalId?: string;
  date?: string;
}
export type SavingsDestination = "buffer" | "goal" | "general" | "long" | "debt";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: "money" | "goal" | "buffer" | "review" | "deadline";
  read: boolean;
  createdAt: string;
}
export interface Expenses {
  rent: string; food: string; utilities: string; phone: string; fuel: string;
  education: string; medical: string; debt: string; family: string; other: string;
}
export interface AppState {
  accountId: string;
  authMode: "login" | "signup"; authIdentifier: string;
  screen: Screen; tab: Tab; loggedIn: boolean; onboarded: boolean; lang: Lang;
  locationPermission: "unknown" | "granted" | "manual" | "denied";
  city: string; name: string; age: string; phone: string; occupation: string;
  maritalStatus: string; familyMembers: string; earningMembers: string; emergencyContact: string;
  incomeSource: string; dailyIncome: number; incomeVariability: number; otherIncome: number; spouseIncome: number;
  expenses: Expenses; existingEmergencySavings: number; goals: Goal[];
  upiConnected: boolean; upiId: string; walletBalance: number; generalSavings: number;
  emergencyBuffer: number; emergencyBufferTarget: number; transactions: Txn[]; dailyRecords: DailyRecord[];
  todayIncome: number; todayExpenses: number; savedThisWeek: number; weeklyTarget: number;
  notifications: boolean; analyticsConsent: boolean; tourDone: boolean;
  onboardingStep: Screen; financialStep: number; notificationsList: AppNotification[]; lastReviewMonth: string; activityLog: {id:string; date:string; time:string; action:string}[];
}

const RANGE_MID: Record<string, number> = {
  "": 0, "0-2000": 1000, "2000-5000": 3500, "5000-10000": 7500, "10000+": 12000,
};
export const RANGE_OPTIONS = [
  { value: "0-2000", label: "₹0 – ₹2,000" },
  { value: "2000-5000", label: "₹2,000 – ₹5,000" },
  { value: "5000-10000", label: "₹5,000 – ₹10,000" },
  { value: "10000+", label: "₹10,000+" },
];

export const initialState: AppState = {
  accountId: "", authMode: "login", authIdentifier: "",
  screen: "splash", tab: "home", loggedIn: false, onboarded: false, lang: "en",
  locationPermission: "unknown", city: "", name: "", age: "", phone: "",
  occupation: "", maritalStatus: "", familyMembers: "", earningMembers: "",
  emergencyContact: "", incomeSource: "", dailyIncome: 0, incomeVariability: 0,
  otherIncome: 0, spouseIncome: 0,
  expenses: { rent:"", food:"", utilities:"", phone:"", fuel:"", education:"", medical:"", debt:"", family:"", other:"" },
  existingEmergencySavings: 0, goals: [],
  upiConnected: false, upiId: "", walletBalance: 0, generalSavings: 0,
  emergencyBuffer: 0, emergencyBufferTarget: 0,
  dailyRecords: [], transactions: [], todayIncome: 0, todayExpenses: 0, savedThisWeek: 0, weeklyTarget: 0,
  notifications: true, analyticsConsent: false, tourDone: false, onboardingStep: "langloc",
  financialStep: 0, onboardingPortalIndex: 0, activityLog: [],
  notificationsList: [
    { id: "n1", title: "Complete today's money record", body: "A quick check-in keeps your daily picture accurate.", type: "money", read: false, createdAt: new Date().toISOString() },
    { id: "n2", title: "Emergency buffer", body: "You're building a cushion for medical and vehicle surprises.", type: "buffer", read: false, createdAt: new Date().toISOString() },
  ],
  lastReviewMonth: "",
};

// Fresh submission/demo state: no previous user's money, goals or transactions.
export const freshState = (): AppState => ({
  ...initialState,
  accountId: "", screen: "splash", tab: "home", loggedIn: false, onboarded: false,
  locationPermission: "unknown", city: "", name: "", age: "", phone: "", occupation: "",
  maritalStatus: "", familyMembers: "", earningMembers: "", emergencyContact: "", incomeSource: "",
  dailyIncome: 0, incomeVariability: 0, otherIncome: 0, spouseIncome: 0,
  expenses: { rent:"", food:"", utilities:"", phone:"", fuel:"", education:"", medical:"", debt:"", family:"", other:"" },
  existingEmergencySavings: 0, goals: [], upiConnected: false, upiId: "", walletBalance: 0, generalSavings: 0,
  emergencyBuffer: 0, emergencyBufferTarget: 0, transactions: [], dailyRecords: [], todayIncome: 0, todayExpenses: 0,
  savedThisWeek: 0, weeklyTarget: 0, notificationsList: [], tourDone: false, onboardingStep: "langloc",
  financialStep: 0, lastReviewMonth: "", activityLog: [],
});

export function monthlyExpenses(e: Expenses) {
  return Object.values(e).reduce((sum, v) => sum + (RANGE_MID[v] ?? 0), 0);
}
export function essentialDaily(s: AppState) {
  const keys: (keyof Expenses)[] = ["rent", "food", "utilities", "phone", "fuel", "debt"];
  return Math.round(keys.reduce((sum, k) => sum + (RANGE_MID[s.expenses[k]] ?? 0), 0) / 30);
}
export function flexibleDaily(s: AppState) {
  return Math.max(0, Math.round(monthlyExpenses(s.expenses) / 30) - essentialDaily(s));
}
export function dailyTotals(s: AppState, date: string) {
  const entries = s.dailyRecords.find(d => d.date === date)?.entries ?? [];
  return entries.reduce((a, e) => ({ income: a.income + e.income, expense: a.expense + e.expense }), { income: 0, expense: 0 });
}
export function earliestMissingDate(s: AppState, through = localDate()) {
  const end = new Date(`${through}T12:00:00`);
  if (!s.dailyRecords.length) return through;
  const dates = new Set(s.dailyRecords.filter(d=>d.entries.length>0).map(d=>d.date));
  const start = new Date(Math.min(...Array.from(dates).map(d=>new Date(`${d}T12:00:00`).getTime())));
  for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate()+1)) {
    const ds = `${cursor.getFullYear()}-${String(cursor.getMonth()+1).padStart(2,"0")}-${String(cursor.getDate()).padStart(2,"0")}`;
    if (!dates.has(ds)) return ds;
  }
  return through;
}

export interface SavingsPlan {
  permanent: number;
  buffer: number;
  goal: number;
  goalId?: string;
  total: number;
}

function round10(n:number){ return Math.max(0, Math.round(n/10)*10); }
function recentSurpluses(s: AppState) {
  return s.dailyRecords.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,7)
    .map(d=>dailyTotals(s,d.date)).filter(x=>x.income>0).map(x=>Math.max(0,x.income-x.expense));
}

// Adaptive prototype heuristic: no fixed "save X%" rule. The recommendation
// reacts to today's surplus, recent earning/spending experience, emergency gap,
// and active goal urgency. It is a product prototype, not financial advice.
export function savingsPlanFor(income:number, expenses:number, s:AppState): SavingsPlan {
  const surplus=Math.max(0, income-expenses);
  if (!income || surplus < 20) return {permanent:0,buffer:0,goal:0,total:0};
  const history=recentSurpluses(s);
  const typical=history.length ? history.reduce((a,b)=>a+b,0)/history.length : surplus;
  const recentCapacity=Math.max(0, Math.min(surplus, typical));
  const active=s.goals.find(g=>g.status!=='paused' && g.status!=='completed');
  const goalUrgency=active ? Math.max(0, Math.min(1, (new Date(active.targetDate).getTime()-Date.now())/(1000*60*60*24*90))) : 0;
  const bufferGap=s.emergencyBufferTarget>0 ? Math.max(0,1-s.emergencyBuffer/s.emergencyBufferTarget) : 0.5;
  // Start from a flexible rupee capacity rather than a percentage. Higher,
  // repeatable surplus increases the amount; low/volatile surplus protects cash.
  let permanent=round10(Math.min(150, Math.max(30, recentCapacity*0.14)));
  if (surplus < 300) permanent=round10(Math.min(permanent, surplus*0.15));
  if (surplus >= 600 && surplus < 1000 && permanent < 100) permanent=100;
  if (bufferGap < 0.25 && goalUrgency < 0.35) permanent=Math.min(permanent,100);
  permanent=Math.min(permanent, Math.max(0, surplus-20));
  let remaining=Math.max(0, surplus-permanent);
  const buffer=Math.min(bufferGap>0.15?10:5, remaining);
  remaining-=buffer;
  const goal=active ? Math.min(goalUrgency>0.7?10:5, remaining) : 0;
  return {permanent,buffer,goal,goalId:active?.id,total:permanent+buffer+goal};
}


function normalizeState(saved: Partial<AppState> | null | undefined): AppState {
  const base = freshState();
  const raw = (saved && typeof saved === "object") ? saved : {};
  const expenses = raw.expenses && typeof raw.expenses === "object" ? raw.expenses as Partial<Expenses> : {};
  const expenseKeys: (keyof Expenses)[] = ["rent","food","utilities","phone","fuel","education","medical","debt","family","other"];
  const normalizedExpenses = expenseKeys.reduce((acc, key) => { acc[key] = typeof expenses[key] === "string" ? expenses[key]! : ""; return acc; }, {} as Expenses);
  const goals = Array.isArray(raw.goals) ? raw.goals.filter(Boolean).map((g:any) => ({
    id: String(g.id ?? `goal-${Math.random().toString(36).slice(2,8)}`),
    name: String(g.name ?? "Goal"), target: Number(g.target ?? 0), current: Number(g.current ?? 0),
    targetDate: String(g.targetDate ?? ""), status: g.status === "paused" || g.status === "completed" ? g.status : "active",
    contributionPreference: Number(g.contributionPreference ?? 0), planMode: g.planMode === "own" || g.planMode === "help" ? g.planMode : "anvesha",
  })) : [];
  const transactions = Array.isArray(raw.transactions) ? raw.transactions.filter(Boolean).map((t:any) => ({
    id: String(t.id ?? `txn-${Math.random().toString(36).slice(2,8)}`), type: t.type === "withdrawal" ? "withdrawal" : "deposit",
    amount: Number(t.amount ?? 0), label: String(t.label ?? ""), when: String(t.when ?? "Today"), goalId: t.goalId ? String(t.goalId) : undefined, date: t.date ? String(t.date) : undefined,
  })) : [];
  const dailyRecords = Array.isArray(raw.dailyRecords) ? raw.dailyRecords.filter(Boolean).map((d:any) => ({
    date: String(d.date ?? ""),
    entries: Array.isArray(d.entries) ? d.entries.filter(Boolean).map((e:any) => ({
      id: String(e.id ?? `entry-${Math.random().toString(36).slice(2,8)}`), income: Number(e.income ?? 0), expense: Number(e.expense ?? 0),
      category: e.category ? String(e.category) : undefined, note: e.note ? String(e.note) : undefined,
    })) : [],
  })).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d.date)) : [];
  const notificationsList = Array.isArray(raw.notificationsList) ? raw.notificationsList.filter(Boolean).map((n:any) => ({
    id: String(n.id ?? `n-${Math.random().toString(36).slice(2,8)}`), title: String(n.title ?? "Notification"), body: String(n.body ?? ""),
    type: ["money","goal","buffer","review","deadline"].includes(n.type) ? n.type : "money", read: !!n.read, createdAt: String(n.createdAt ?? new Date().toISOString()),
  })) : [];
  const activityLog = Array.isArray(raw.activityLog) ? raw.activityLog.filter(Boolean).map((a:any) => ({
    id: String(a.id ?? `a-${Math.random().toString(36).slice(2,8)}`), date: String(a.date ?? localDate()), time: String(a.time ?? ""), action: String(a.action ?? ""),
  })) : [];
  return {
    ...base, ...raw, expenses: normalizedExpenses, goals, transactions, dailyRecords, notificationsList, activityLog,
    dailyIncome: Number(raw.dailyIncome ?? 0), incomeVariability: Number(raw.incomeVariability ?? 0), otherIncome: Number(raw.otherIncome ?? 0), spouseIncome: Number(raw.spouseIncome ?? 0),
    existingEmergencySavings: Number(raw.existingEmergencySavings ?? 0), walletBalance: Number(raw.walletBalance ?? 0), generalSavings: Number(raw.generalSavings ?? 0),
    emergencyBuffer: Number(raw.emergencyBuffer ?? 0), emergencyBufferTarget: Number(raw.emergencyBufferTarget ?? 0), todayIncome: Number(raw.todayIncome ?? 0), todayExpenses: Number(raw.todayExpenses ?? 0),
    savedThisWeek: Number(raw.savedThisWeek ?? 0), weeklyTarget: Number(raw.weeklyTarget ?? 0), financialStep: Math.max(0, Math.min(7, Number(raw.financialStep ?? 0))),
    onboardingPortalIndex: Number.isFinite(Number(raw.onboardingPortalIndex)) ? Number(raw.onboardingPortalIndex) : 0,
    loggedIn: !!raw.loggedIn, onboarded: !!raw.onboarded, notifications: raw.notifications !== false, analyticsConsent: !!raw.analyticsConsent,
    screen: ["splash","auth","otp","langloc","name","intro","tour","onboardingHub","personal","financial","whysave","goalsetup","upi","budget","app"].includes(String(raw.screen)) ? raw.screen as Screen : "splash",
    tab: ["home","goals","wallet","profile"].includes(String(raw.tab)) ? raw.tab as Tab : "home",
    lang: typeof raw.lang === "string" ? raw.lang as Lang : "en", accountId: String(raw.accountId ?? base.accountId), authMode: raw.authMode === "signup" ? "signup" : "login", authIdentifier: String(raw.authIdentifier ?? ""),
  } as AppState;
}

export function recommendedSavingFor(income:number, expenses:number, s:AppState) {
  return savingsPlanFor(income, expenses, s).permanent;
}
export function savedOnDate(s: AppState, date: string) {
  return s.transactions.filter(t => t.type === "deposit" && (t.date === date || (!t.date && t.when === "Today" && date === localDate()))).reduce((sum, t) => sum + t.amount, 0);
}
export function savedToday(s: AppState) { return savedOnDate(s, localDate()); }
export function recommendedSavingForDate(s: AppState, date: string) {
  const totals = dailyTotals(s, date);
  const income = totals.income;
  const expense = totals.expense;
  if (!income) return 0;
  return Math.max(0, recommendedSavingFor(income, expense, s) - savedOnDate(s, date));
}
export function recommendedSaving(s: AppState) {
  const date = localDate();
  const totals = dailyTotals(s, date);
  const effectiveIncome = totals.income || s.todayIncome;
  const effectiveExpense = totals.expense || s.todayExpenses;
  return Math.max(0, recommendedSavingFor(effectiveIncome, effectiveExpense, s) - savedOnDate(s, date));
}
export function adaptiveSavingFor(income: number, expenses: number, s: AppState) {
  return recommendedSavingFor(income, expenses, s);
}
export function availableSpending(s: AppState) {
  const { income, expense } = dailyTotals(s, localDate());
  const i = income || s.todayIncome, e = expense || s.todayExpenses;
  const safeSurplus = Math.max(0, i - e);
  return Math.max(0, safeSurplus - recommendedSavingFor(i, e, s) - savedOnDate(s, localDate()));
}
export function activeGoal(s: AppState) {
  return s.goals.find(g => g.status !== "paused" && g.status !== "completed") ?? s.goals[0];
}
export function emergencyTargetFromExpenses(s: AppState) {
  return Math.max(3000, essentialDaily(s) * 14);
}
export function portalStatuses(s: AppState): Record<string, PortalStatus> {
  return {
    personal: s.name && s.age && s.phone && s.occupation ? "complete" : "inProgress",
    financial: s.dailyIncome > 0 && !!s.expenses.food && !!s.expenses.rent ? "complete" : "inProgress",
    goals: s.goals.length ? "complete" : "needsAttention",
    emergency: s.emergencyBufferTarget > 0 ? "complete" : "notStarted",
    budget: s.dailyIncome > 0 ? "complete" : "notStarted",
    upi: s.upiConnected ? "complete" : "needsAttention",
  };
}

interface Ctx {
  state: AppState; set: (patch: Partial<AppState>) => void; go: (screen: Screen) => void; authenticate: (mode: "login" | "signup", identifier: string) => { ok: boolean; message?: string }; setTab: (tab: Tab) => void;
  overlay: Overlay; openOverlay: (o: Overlay) => void; closeOverlay: () => void;
  deposit: (amount: number, goalId?: string) => void; applySavingsPlan: (plan: SavingsPlan) => void; allocateSavings: (amount: number, destination: SavingsDestination, goalId?: string) => void; addDailyRecord: (date: string, income: number, expense: number, category?: string, note?: string) => void; editDailyEntry: (date: string, entryId: string, patch: Partial<DailyRecord["entries"][number]>) => void; deleteDailyEntry: (date: string, entryId: string) => void;
  withdraw: (amount: number) => void; resetDemo: () => void; markNotificationRead: (id: string) => void;
}
const AnveshaContext = createContext<Ctx | null>(null);
const KEY = "anvesha-state-v2";
const ACCOUNTS_KEY = "anvesha-accounts-v1";
const localDate = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };

export function AnveshaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [overlay, setOverlay] = useState<Overlay>({ kind: "none" });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      // One-time clean start for the submission build: remove all previously
      // stored demo/user data, then allow normal persistence for new users.
      const RESET_VERSION = "anvesha-clean-start-v9-final";
      if (localStorage.getItem(RESET_VERSION) !== "done") {
        localStorage.removeItem(KEY);
        localStorage.removeItem("anvesha-state-v1");
        localStorage.removeItem(ACCOUNTS_KEY);
        localStorage.setItem(RESET_VERSION, "done");
      }
      const raw = localStorage.getItem(KEY);
      // initialState is already a clean, empty state. Do not asynchronously
      // replace it after the first paint: doing so can swallow a fast first
      // click on Get Started before hydration finishes.
      if (raw) {
        const saved = JSON.parse(raw);
        const merged = normalizeState(saved);
        merged.accountId = saved.accountId ?? "demo";
        if (merged.loggedIn && (merged.screen === "auth" || merged.screen === "otp")) {
          const resume = merged.onboarded ? "app" : ((["splash", "auth", "otp", "app"] as string[]).includes(merged.onboardingStep) ? "langloc" : merged.onboardingStep);
          merged.screen = resume;
          if (!merged.onboarded) merged.onboardingStep = resume;
        }
        if (!merged.loggedIn && merged.screen === "app") merged.screen = "auth";
        setState(merged);
      }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
      if (state.accountId) {
        accounts[state.accountId] = state;
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      }
    } catch {}
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated || !state.loggedIn || !state.notifications) return;
    const now = new Date(); const date = localDate(); const additions: AppNotification[] = [];
    const hasToday = state.dailyRecords.some(d => d.date === date && d.entries.length > 0);
    if (((now.getHours() >= 20 && now.getHours() < 22) || now.getHours() === 0) && !hasToday && !state.notificationsList.some(n => n.id === `money-reminder-${date}`)) additions.push({ id:`money-reminder-${date}`, title:"Complete today's money record", body:"A quick check-in helps keep today's money picture accurate.", type:"money", read:false, createdAt:now.toISOString() });
    const y = new Date(now); y.setDate(y.getDate()-1); const yd = `${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,"0")}-${String(y.getDate()).padStart(2,"0")}`;
    if (!state.dailyRecords.some(d => d.date === yd && d.entries.length > 0) && !state.notificationsList.some(n => n.id === `missing-${yd}`)) additions.push({ id:`missing-${yd}`, title:"Yesterday is missing", body:"You can fill in yesterday's record without inventing any amounts.", type:"money", read:false, createdAt:now.toISOString() });
    if (additions.length) setState(s => ({ ...s, notificationsList:[...additions,...s.notificationsList].slice(0,20) }));
  }, [hydrated, state.loggedIn, state.notifications, state.dailyRecords, state.notificationsList.length]);

  const value = useMemo<Ctx>(() => {
    const set = (patch: Partial<AppState>) => setState(s => ({ ...s, ...patch }));
    return {
      state,
      set,
      go: (screen) => {
        setOverlay({ kind: "none" });
        // Splash/auth/OTP/app are navigation checkpoints, not resumable
        // onboarding steps. Only actual onboarding destinations update the
        // persisted resume point.
        const isOnboardingDestination = !["splash", "auth", "otp", "app"].includes(screen);
        setState(s => ({
          ...s,
          screen,
          onboardingStep: isOnboardingDestination ? screen : s.onboardingStep,
        }));
      },
      authenticate: (mode, identifier) => {
        const id = identifier.trim().toLowerCase();
        if (!id) return { ok: false, message: "Please enter your mobile number or email." };
        let result: { ok: boolean; message?: string } = { ok: true };
        setState(current => {
          let accounts: Record<string, AppState> = {};
          try { accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}"); } catch {}
          if (mode === "signup") {
            if (accounts[id]) { result = { ok: false, message: "An account already exists for this mobile number or email. Please log in." }; return current; }
            const fresh: AppState = {
              ...initialState,
              accountId: id,
              screen: "langloc",
              loggedIn: true,
              onboarded: false,
              lang: "en",
              locationPermission: "unknown",
              city: "",
              name: "",
              age: "",
              phone: /^\d/.test(id) ? identifier : "",
              occupation: "",
              maritalStatus: "",
              familyMembers: "",
              earningMembers: "",
              emergencyContact: "",
              incomeSource: "",
              dailyIncome: 0,
              incomeVariability: 0,
              otherIncome: 0,
              spouseIncome: 0,
              expenses: { rent:"", food:"", utilities:"", phone:"", fuel:"", education:"", medical:"", debt:"", family:"", other:"" },
              existingEmergencySavings: 0,
              goals: [],
              upiConnected: false,
              upiId: "",
              walletBalance: 0,
              generalSavings: 0,
              emergencyBuffer: 0,
              emergencyBufferTarget: 0,
              transactions: [],
              dailyRecords: [],
              todayIncome: 0,
              todayExpenses: 0,
              savedThisWeek: 0,
              weeklyTarget: 0,
              notificationsList: [],
              tourDone: false,
              onboardingStep: "langloc",
              onboardingPortalIndex: 0,
              activityLog: [],
            };
            accounts[id] = fresh;
            try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)); } catch {}
            return fresh;
          }
          let found = accounts[id];
          if (!found && id === initialState.phone.replace(/\s/g, "").toLowerCase()) found = { ...initialState, accountId: "demo" };
          if (!found) { result = { ok: false, message: "No account found. Choose Sign Up to create a new account." }; return current; }
          const merged = normalizeState(found);
          merged.loggedIn = true;
          merged.screen = "app";
          try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify({ ...accounts, [id]: merged })); } catch {}
          return merged;
        });
        return result;
      },
      setTab: (tab) => { setOverlay({ kind: "none" }); set({ tab, screen: "app" }); },
      overlay, openOverlay: setOverlay, closeOverlay: () => setOverlay({ kind: "none" }),
      deposit: (amount, goalId) => setState(s => {
        const v = Math.max(0, Math.floor(amount));
        if (!v) return s;
        const goals = goalId ? s.goals.map(g => g.id === goalId
          ? { ...g, current: Math.min(g.target, g.current + v), status: g.current + v >= g.target ? "completed" : g.status }
          : g) : s.goals;
        const target = goalId ? s.goals.find(g => g.id === goalId) : undefined;
        return {
          ...s,
          walletBalance: s.walletBalance + v,
          generalSavings: goalId ? s.generalSavings : s.generalSavings + v,
          savedThisWeek: s.savedThisWeek + v,
          transactions: [{ id: "t" + Date.now(), type: "deposit", amount: v, label: goalId ? `Saved to ${target?.name}` : "General savings", when: "Today", date: localDate(), goalId }, ...s.transactions],
        };
      }),
      applySavingsPlan: (plan) => setState(s => {
        const total=Math.max(0, Math.floor(plan.total));
        if (!total) return s;
        const goals=plan.goal && plan.goalId ? s.goals.map(g=>g.id===plan.goalId ? {...g,current:Math.min(g.target,g.current+plan.goal),status:g.current+plan.goal>=g.target?"completed":g.status}:g) : s.goals;
        const txns=[
          ...(plan.permanent?[{id:"t"+Date.now()+"p",type:"deposit" as const,amount:plan.permanent,label:"Permanent savings",when:"Today",date:localDate()}]:[]),
          ...(plan.buffer?[{id:"t"+Date.now()+"b",type:"deposit" as const,amount:plan.buffer,label:"Emergency buffer",when:"Today",date:localDate()}]:[]),
          ...(plan.goal?[{id:"t"+Date.now()+"g",type:"deposit" as const,amount:plan.goal,label:"Goal saving",when:"Today",date:localDate(),goalId:plan.goalId}]:[]),
          ...s.transactions,
        ];
        return {...s,walletBalance:s.walletBalance+total,generalSavings:s.generalSavings+plan.permanent,emergencyBuffer:Math.min(s.emergencyBufferTarget,s.emergencyBuffer+plan.buffer),goals,savedThisWeek:s.savedThisWeek+total,transactions:txns,activityLog:[...s.activityLog,{id:"a"+Date.now(),date:localDate(),time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),action:`Saved ₹${total}: ₹${plan.permanent} permanent${plan.buffer?`, ₹${plan.buffer} buffer`:""}${plan.goal?`, ₹${plan.goal} goal`:""}` }].slice(-100)};
      }),
      allocateSavings: (amount, destination, goalId) => setState(s => {
        const v = Math.max(0, Math.floor(amount));
        if (!v) return s;
        const targetGoal = goalId ? s.goals.find(g => g.id === goalId) : undefined;
        const isGoal = destination === "goal" && !!targetGoal;
        const isBuffer = destination === "buffer";
        const goals = isGoal ? s.goals.map(g => g.id === goalId
          ? { ...g, current: Math.min(g.target, g.current + v), status: g.current + v >= g.target ? "completed" : g.status }
          : g) : s.goals;
        const labels: Record<SavingsDestination, string> = { buffer: "Emergency buffer", goal: targetGoal?.name ?? "Goal savings", general: "General savings", long: "Long-term saving", debt: "Debt repayment" };
        return {
          ...s,
          walletBalance: s.walletBalance + v,
          generalSavings: destination === "general" || destination === "long" || destination === "debt" ? s.generalSavings + v : s.generalSavings,
          emergencyBuffer: isBuffer ? Math.min(s.emergencyBufferTarget, s.emergencyBuffer + v) : s.emergencyBuffer,
          savedThisWeek: s.savedThisWeek + v,
          goals,
          transactions: [{ id: "t" + Date.now(), type: "deposit", amount: v, label: labels[destination], when: "Today", date: localDate(), goalId: isGoal ? goalId : undefined }, ...s.transactions],
        };
      }),
      editDailyEntry: (date, entryId, patch) => setState(s => ({ ...s, dailyRecords: s.dailyRecords.map(d => d.date === date ? { ...d, entries: d.entries.map(e => e.id === entryId ? { ...e, ...patch } : e) } : d) })),
      deleteDailyEntry: (date, entryId) => setState(s => ({ ...s, dailyRecords: s.dailyRecords.map(d => d.date === date ? { ...d, entries: d.entries.filter(e => e.id !== entryId) } : d).filter(d => d.entries.length > 0) })),
      addDailyRecord: (date, income, expense, category, note) => setState(s => {
        const earliest=earliestMissingDate(s,localDate());
        if (date>earliest) return s;
        const entry = { id: "d" + Date.now() + Math.random().toString(36).slice(2,5), income: Math.max(0, income), expense: Math.max(0, expense), category, note };
        const dailyRecords = s.dailyRecords.some(d => d.date === date)
          ? s.dailyRecords.map(d => d.date === date ? { ...d, entries: [...d.entries, entry] } : d)
          : [...s.dailyRecords, { date, entries: [entry] }];
        const totals = dailyTotals({ ...s, dailyRecords }, date);
        const today = localDate();
        const notificationsList = date === today ? [
          { id: "n" + Date.now(), title: "Money record updated", body: `Today: ₹${Math.round(totals.income)} income and ₹${Math.round(totals.expense)} expenses.`, type: "money" as const, read: false, createdAt: new Date().toISOString() },
          ...s.notificationsList,
        ].slice(0, 20) : s.notificationsList;
        return { ...s, dailyRecords, notificationsList, activityLog:[...s.activityLog,{id:"a"+Date.now(),date,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),action:`Recorded ${income>0?"income":"expense"} of ₹${Math.round(income||expense)}${category?` · ${category}`:""}`}].slice(-100), ...(date === today ? { todayIncome: totals.income, todayExpenses: totals.expense } : {}) };
      }),
      withdraw: (amount) => setState(s => {
        const v = Math.min(Math.max(0, Math.floor(amount)), s.walletBalance);
        return {
          ...s, walletBalance: s.walletBalance - v, generalSavings: Math.max(0, s.generalSavings - v),
          transactions: [{ id: "t" + Date.now(), type: "withdrawal", amount: v, label: "Withdrawal to UPI", when: "Today", date: localDate() }, ...s.transactions],
        };
      }),
      markNotificationRead: (id) => setState(s => ({ ...s, notificationsList: s.notificationsList.map(n => n.id === id ? { ...n, read: true } : n) })),
      resetDemo: () => { setOverlay({ kind: "none" }); setState(freshState()); },
    };
  }, [state, overlay]);
  return <AnveshaContext.Provider value={value}>{children}</AnveshaContext.Provider>;
}
export function useAnvesha() {
  const ctx = useContext(AnveshaContext);
  if (!ctx) throw new Error("useAnvesha must be used inside AnveshaProvider");
  return ctx;
}
