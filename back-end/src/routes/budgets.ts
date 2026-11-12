import { Router, Response } from 'express';
import { Budget, Transaction } from '../models/models';
import { AuthRequest } from '../middleware/auth';
import {
  CreateBudgetSchema,
  UpdateBudgetSchema
} from '../schemas/validation';

const router = Router();

// Helper: Calculate budget status based on spent amount
function getBudgetStatus(spent: number, limit: number): 'UNDER' | 'WARNING' | 'EXCEEDED' {
  const percentage = (spent / limit) * 100;
  if (percentage >= 100) return 'EXCEEDED';
  if (percentage >= 80) return 'WARNING';
  return 'UNDER';
}

// Helper: Calculate spent amount for budget period
async function calculateSpent(
  email: string,
  category: string,
  startDate: string,
  endDate: string
): Promise<number> {
  if (!startDate || !endDate) return 0;

  const transactions = await Transaction.find({
    email,
    category,
    option: 'EXPENSE',
    date: { $gte: startDate, $lte: endDate }
  });

  return transactions.reduce((sum, t) => sum + t.price, 0);
}

// POST /v1/api/budgets - Create budget
router.post('/v1/api/budgets', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = CreateBudgetSchema.parse(req.body);
    const email = req.email;

    // Validate date range
    if (validatedData.startDate >= validatedData.endDate) {
      res.status(400).json({ error: 'Start date must be before end date' });
      return;
    }

    const spent = await calculateSpent(
      email!,
      validatedData.category,
      validatedData.startDate!,
      validatedData.endDate!
    );
    const status = getBudgetStatus(spent, validatedData.limit);

    const budget = await Budget.create({
      email,
      ...validatedData,
      spent,
      status
    });

    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (err: any) {
    console.error('Create budget error:', err);
    if (err.name === 'ZodError') {
      res.status(400).json({ success: false, error: 'Validation error', details: err.errors });
    } else {
      res.status(500).json({ error: 'Failed to create budget' });
    }
  }
});

// GET /v1/api/budgets - Get all budgets
router.get('/v1/api/budgets', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const email = req.email;
    const { period } = req.query;

    const filter: any = { email };
    if (period) {
      filter.period = (period as string).toUpperCase();
    }

    const budgets = await Budget.find(filter).sort({ startDate: -1 });

    // Recalculate spent amounts
    const updatedBudgets = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await calculateSpent(
          email!,
          budget.category,
          budget.startDate!,
          budget.endDate!
        );
        const status = getBudgetStatus(spent, budget.limit);

        // Update in database
        await Budget.updateOne(
          { _id: budget._id },
          { $set: { spent, status } }
        );

        return {
          ...budget.toObject(),
          spent,
          status
        };
      })
    );

    res.status(200).json({
      success: true,
      data: updatedBudgets
    });
  } catch (err) {
    console.error('Fetch budgets error:', err);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// GET /v1/api/budgets/:id - Get single budget
router.get('/v1/api/budgets/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const email = req.email;

    const budget = await Budget.findOne({ _id: id, email });

    if (!budget) {
      res.status(404).json({ error: 'Budget not found' });
      return;
    }

    // Recalculate spent
    const spent = await calculateSpent(email!, budget.category, budget.startDate!, budget.endDate!);
    const status = getBudgetStatus(spent, budget.limit);

    res.status(200).json({
      success: true,
      data: {
        ...budget.toObject(),
        spent,
        status,
        utilized: Math.round((spent / budget.limit) * 100),
        remaining: Math.max(0, budget.limit - spent)
      }
    });
  } catch (err) {
    console.error('Fetch budget error:', err);
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
});

// PATCH /v1/api/budgets/:id - Update budget
router.patch('/v1/api/budgets/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const email = req.email;

    const validatedData = UpdateBudgetSchema.parse(req.body);

    const budget = await Budget.findOneAndUpdate(
      { _id: id, email },
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!budget) {
      res.status(404).json({ error: 'Budget not found' });
      return;
    }

    // Recalculate spent
    const spent = await calculateSpent(
      email!,
      budget.category,
      budget.startDate!,
      budget.endDate!
    );
    const status = getBudgetStatus(spent, budget.limit);

    res.status(200).json({
      success: true,
      message: 'Budget updated',
      data: {
        ...budget.toObject(),
        spent,
        status
      }
    });
  } catch (err: any) {
    console.error('Update budget error:', err);
    if (err.name === 'ZodError') {
      res.status(400).json({ success: false, error: 'Validation error', details: err.errors });
    } else {
      res.status(500).json({ error: 'Failed to update budget' });
    }
  }
});

// DELETE /v1/api/budgets/:id - Delete budget
router.delete('/v1/api/budgets/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const email = req.email;

    const budget = await Budget.findOneAndDelete({ _id: id, email });

    if (!budget) {
      res.status(404).json({ error: 'Budget not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Budget deleted',
      data: { _id: id }
    });
  } catch (err) {
    console.error('Delete budget error:', err);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

// GET /v1/api/budgets/:id/progress - Get detailed budget progress
router.get('/v1/api/budgets/:id/progress', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const email = req.email;

    const budget = await Budget.findOne({ _id: id, email });

    if (!budget) {
      res.status(404).json({ error: 'Budget not found' });
      return;
    }

    const spent = await calculateSpent(
      email!,
      budget.category,
      budget.startDate!,
      budget.endDate!
    );
    const remaining = Math.max(0, budget.limit - spent);
    const utilization = Math.round((spent / budget.limit) * 100);
    const status = getBudgetStatus(spent, budget.limit);

    res.status(200).json({
      success: true,
      data: {
        budgetId: budget._id,
        category: budget.category,
        period: budget.period,
        limit: budget.limit,
        spent,
        remaining,
        utilization,
        status,
        warning: status === 'WARNING' || status === 'EXCEEDED',
        message:
          status === 'EXCEEDED'
            ? `Budget exceeded by $${(spent - budget.limit).toFixed(2)}`
            : status === 'WARNING'
              ? `80% of budget used. $${remaining.toFixed(2)} remaining`
              : `$${remaining.toFixed(2)} remaining`
      }
    });
  } catch (err) {
    console.error('Budget progress error:', err);
    res.status(500).json({ error: 'Failed to fetch budget progress' });
  }
});

export default router;
