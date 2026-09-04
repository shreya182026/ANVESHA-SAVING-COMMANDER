export type MoneyEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  type: "income" | "expense";
  amount: number;
  category?: string;
  note?: string;
  createdAt: string;
};

export type DailyReport = {
  date: string;
  income: number;
  expenses: number;
  net: number;
  entries: MoneyEntry[];
};

export function addMoneyEntry(
  entries: MoneyEntry[],
  entry: Omit<MoneyEntry, "id" | "createdAt">
): MoneyEntry[] {
  const next: MoneyEntry = {
    ...entry,
    id: `${entry.date}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  return [...entries, next];
}

export function getDailyReport(entries: MoneyEntry[], date: string): DailyReport {
  const day = entries.filter(e => e.date === date);
  const income = day.filter(e => e.type === "income").reduce((s, e) => s + Number(e.amount || 0), 0);
  const expenses = day.filter(e => e.type === "expense").reduce((s, e) => s + Number(e.amount || 0), 0);
  return { date, income, expenses, net: income - expenses, entries: day };
}

export function getMonthReport(entries: MoneyEntry[], year: number, month: number) {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
  const days = Array.from(new Set(entries.filter(e => e.date.startsWith(prefix)).map(e => e.date))).sort();
  const reports = days.map(d => getDailyReport(entries, d));
  return {
    year, month,
    days: reports,
    income: reports.reduce((s, r) => s + r.income, 0),
    expenses: reports.reduce((s, r) => s + r.expenses, 0),
    net: reports.reduce((s, r) => s + r.net, 0),
  };
}
