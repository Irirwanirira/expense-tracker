import { Transaction, ITransaction } from '../models/models';

interface ReportBreakdown {
  byCategory: Array<{ category: string; expenses: number; percentage: number }>;
  byMethod: Array<{ method: string; total: number; count: number }>;
  byType: { income: number; expense: number };
}

interface ReportTrends {
  previousMonth?: { totalIncome: number; totalExpense: number; netSavings: number };
  monthOverMonthChange?: { income: number; expense: number; savings: number };
}

export interface ReportData {
  period: {
    month?: number;
    year?: number;
    startDate: string;
    endDate: string;
  };
  summary: {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    transactionCount: number;
  };
  breakdown: ReportBreakdown;
  trends?: ReportTrends;
}

function getMonthDateRange(month: number, year: number): { startDate: string; endDate: string } {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
}

export async function generateMonthlyStatement(
  email: string,
  month: number,
  year: number,
  includeComparison: boolean = false
): Promise<ReportData> {
  const { startDate, endDate } = getMonthDateRange(month, year);

  const transactions = await Transaction.find({
    email,
    date: { $gte: startDate, $lte: endDate }
  }).lean();

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryMap = new Map<string, number>();
  const methodMap = new Map<string, { total: number; count: number }>();

  transactions.forEach((t) => {
    if (t.option === 'INCOME') {
      totalIncome += t.price;
    } else {
      totalExpense += t.price;
    }

    if (t.option === 'EXPENSE') {
      const category = t.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + t.price);
    }

    const method = t.method;
    const current = methodMap.get(method) || { total: 0, count: 0 };
    methodMap.set(method, { total: current.total + t.price, count: current.count + 1 });
  });

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    expenses: Math.round(amount * 100) / 100,
    percentage: 0
  }));

  const categoryTotal = categoryBreakdown.reduce((sum, c) => sum + c.expenses, 0);
  categoryBreakdown.forEach((c) => {
    c.percentage = categoryTotal > 0 ? Math.round((c.expenses / categoryTotal) * 100 * 100) / 100 : 0;
  });
  categoryBreakdown.sort((a, b) => b.expenses - a.expenses);

  const methodBreakdown = Array.from(methodMap.entries())
    .map(([method, data]) => ({
      method,
      total: Math.round(data.total * 100) / 100,
      count: data.count
    }))
    .sort((a, b) => b.total - a.total);

  const netSavings = totalIncome - totalExpense;

  const report: ReportData = {
    period: { month, year, startDate, endDate },
    summary: {
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpense: Math.round(totalExpense * 100) / 100,
      netSavings: Math.round(netSavings * 100) / 100,
      transactionCount: transactions.length
    },
    breakdown: {
      byCategory: categoryBreakdown,
      byMethod: methodBreakdown,
      byType: {
        income: Math.round(totalIncome * 100) / 100,
        expense: Math.round(totalExpense * 100) / 100
      }
    }
  };

  if (includeComparison && month > 1) {
    const prevMonth = month - 1;
    const prevReport = await generateMonthlyStatement(email, prevMonth, year, false);

    const incomeChange = prevReport.summary.totalIncome
      ? ((report.summary.totalIncome - prevReport.summary.totalIncome) /
          prevReport.summary.totalIncome) *
        100
      : 0;
    const expenseChange = prevReport.summary.totalExpense
      ? ((report.summary.totalExpense - prevReport.summary.totalExpense) /
          prevReport.summary.totalExpense) *
        100
      : 0;
    const savingsChange = prevReport.summary.netSavings
      ? ((report.summary.netSavings - prevReport.summary.netSavings) / prevReport.summary.netSavings) *
        100
      : 0;

    report.trends = {
      previousMonth: prevReport.summary,
      monthOverMonthChange: {
        income: Math.round(incomeChange * 100) / 100,
        expense: Math.round(expenseChange * 100) / 100,
        savings: Math.round(savingsChange * 100) / 100
      }
    };
  }

  return report;
}

export async function generateCustomReport(
  email: string,
  startDate: string,
  endDate: string,
  _reportType: 'summary' | 'detailed' | 'comparison' = 'summary'
): Promise<ReportData> {
  const transactions = await Transaction.find({
    email,
    date: { $gte: startDate, $lte: endDate }
  }).lean();

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryMap = new Map<string, number>();
  const methodMap = new Map<string, { total: number; count: number }>();

  transactions.forEach((t) => {
    if (t.option === 'INCOME') {
      totalIncome += t.price;
    } else {
      totalExpense += t.price;
    }

    if (t.option === 'EXPENSE') {
      const category = t.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + t.price);
    }

    const method = t.method;
    const current = methodMap.get(method) || { total: 0, count: 0 };
    methodMap.set(method, { total: current.total + t.price, count: current.count + 1 });
  });

  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      expenses: Math.round(amount * 100) / 100,
      percentage: 0
    }))
    .sort((a, b) => b.expenses - a.expenses);

  const categoryTotal = categoryBreakdown.reduce((sum, c) => sum + c.expenses, 0);
  categoryBreakdown.forEach((c) => {
    c.percentage = categoryTotal > 0 ? Math.round((c.expenses / categoryTotal) * 100 * 100) / 100 : 0;
  });

  const methodBreakdown = Array.from(methodMap.entries())
    .map(([method, data]) => ({
      method,
      total: Math.round(data.total * 100) / 100,
      count: data.count
    }))
    .sort((a, b) => b.total - a.total);

  const netSavings = totalIncome - totalExpense;

  return {
    period: { startDate, endDate },
    summary: {
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpense: Math.round(totalExpense * 100) / 100,
      netSavings: Math.round(netSavings * 100) / 100,
      transactionCount: transactions.length
    },
    breakdown: {
      byCategory: categoryBreakdown,
      byMethod: methodBreakdown,
      byType: {
        income: Math.round(totalIncome * 100) / 100,
        expense: Math.round(totalExpense * 100) / 100
      }
    }
  };
}

export async function getTransactionsForExport(
  email: string,
  startDate: string,
  endDate: string,
  pageSize: number = 1000,
  page: number = 1
): Promise<{ transactions: ITransaction[]; total: number; pages: number }> {
  const offset = (page - 1) * pageSize;
  const [transactions, total] = await Promise.all([
    Transaction.find({
      email,
      date: { $gte: startDate, $lte: endDate }
    })
      .sort({ date: -1 })
      .limit(pageSize)
      .skip(offset)
      .lean(),
    Transaction.countDocuments({
      email,
      date: { $gte: startDate, $lte: endDate }
    })
  ]);

  return {
    transactions,
    total,
    pages: Math.ceil(total / pageSize)
  };
}

export function validateDateRange(startDate: string, endDate: string): { valid: boolean; error?: string } {
  if (startDate >= endDate) {
    return { valid: false, error: 'Start date must be before end date' };
  }
  return { valid: true };
}
