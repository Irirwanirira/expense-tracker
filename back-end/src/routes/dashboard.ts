import { Router, Response } from 'express';
import { Transaction } from '../models/models';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Helper function to get date range
function getDateRange(month?: string, year?: string) {
  const now = new Date();
  const currentYear = year ? parseInt(year) : now.getFullYear();
  const currentMonth = month ? parseInt(month) - 1 : now.getMonth();

  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
}

// GET /v1/api/dashboard/summary - Get financial summary
router.get('/v1/api/dashboard/summary', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const email = req.email;
    const { month, year } = req.query;

    const { startDate, endDate } = getDateRange(month as string, year as string);

    const transactions = await Transaction.find({
      email,
      date: { $gte: startDate, $lte: endDate }
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.option === 'INCOME') {
        totalIncome += t.price;
      } else {
        totalExpense += t.price;
      }
    });

    const balance = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netSavings: balance,
        transactionCount: transactions.length,
        month: month || new Date().getMonth() + 1,
        year: year || new Date().getFullYear()
      }
    });
  } catch (err) {
    console.error('Dashboard summary error:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// GET /v1/api/dashboard/balance - Get current balance
router.get('/v1/api/dashboard/balance', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const email = req.email;

    const transactions = await Transaction.find({ email });

    let balance = 0;
    transactions.forEach((t) => {
      if (t.option === 'INCOME') {
        balance += t.price;
      } else {
        balance -= t.price;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        currentBalance: balance,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Balance fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// GET /v1/api/dashboard/income-vs-expense - Monthly comparison
router.get('/v1/api/dashboard/income-vs-expense', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const email = req.email;
    const { months = 6 } = req.query;
    const numMonths = Math.min(parseInt(months as string) || 6, 12);

    const data: any[] = [];

    for (let i = numMonths - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const { startDate, endDate } = getDateRange(
        (date.getMonth() + 1).toString(),
        date.getFullYear().toString()
      );

      const transactions = await Transaction.find({
        email,
        date: { $gte: startDate, $lte: endDate }
      });

      let income = 0;
      let expense = 0;

      transactions.forEach((t) => {
        if (t.option === 'INCOME') {
          income += t.price;
        } else {
          expense += t.price;
        }
      });

      data.push({
        month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        income,
        expense,
        net: income - expense
      });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error('Income vs expense error:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// GET /v1/api/dashboard/spending-by-category - Category breakdown
router.get('/v1/api/dashboard/spending-by-category', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const email = req.email;
    const { month, year } = req.query;

    const { startDate, endDate } = getDateRange(month as string, year as string);

    const transactions = await Transaction.find({
      email,
      option: 'EXPENSE',
      date: { $gte: startDate, $lte: endDate }
    });

    const categoryMap = new Map<string, number>();

    transactions.forEach((t) => {
      const category = t.category || 'Uncategorized';
      const current = categoryMap.get(category) || 0;
      categoryMap.set(category, current + t.price);
    });

    const data = Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: 0 // Will be calculated on frontend
    }));

    // Calculate percentages
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    data.forEach((item) => {
      item.percentage = total > 0 ? (item.amount / total) * 100 : 0;
    });

    // Sort by amount descending
    data.sort((a, b) => b.amount - a.amount);

    res.status(200).json({
      success: true,
      data: {
        categories: data,
        totalSpent: total
      }
    });
  } catch (err) {
    console.error('Spending by category error:', err);
    res.status(500).json({ error: 'Failed to fetch category spending' });
  }
});

// GET /v1/api/dashboard/recent-transactions - Latest transactions
router.get('/v1/api/dashboard/recent-transactions', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const email = req.email;
    const { limit = 10 } = req.query;

    const transactions = await Transaction.find({ email })
      .sort({ date: -1, createdAt: -1 })
      .limit(parseInt(limit as string))
      .lean();

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (err) {
    console.error('Recent transactions error:', err);
    res.status(500).json({ error: 'Failed to fetch recent transactions' });
  }
});

// GET /v1/api/dashboard/yearly-summary - Yearly overview
router.get('/v1/api/dashboard/yearly-summary', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const email = req.email;
    const { year } = req.query;
    const targetYear = year ? parseInt(year as string) : new Date().getFullYear();

    const startDate = new Date(targetYear, 0, 1).toISOString().split('T')[0];
    const endDate = new Date(targetYear, 11, 31).toISOString().split('T')[0];

    const transactions = await Transaction.find({
      email,
      date: { $gte: startDate, $lte: endDate }
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.option === 'INCOME') {
        totalIncome += t.price;
      } else {
        totalExpense += t.price;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        year: targetYear,
        totalIncome,
        totalExpense,
        netSavings: totalIncome - totalExpense,
        transactionCount: transactions.length,
        averageMonthlyIncome: Math.round(totalIncome / 12),
        averageMonthlyExpense: Math.round(totalExpense / 12)
      }
    });
  } catch (err) {
    console.error('Yearly summary error:', err);
    res.status(500).json({ error: 'Failed to fetch yearly summary' });
  }
});

export default router;
