import { Router, Response } from 'express';
import { Transaction } from '../models/models';
import { AuthRequest } from '../middleware/auth';
import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
  FilterTransactionsSchema
} from '../schemas/validation';

const router = Router();

// POST /v1/api/transactions - Create transaction
router.post('/v1/api/transactions', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = CreateTransactionSchema.parse(req.body);
    const email = req.email;

    const newTrans = await Transaction.create({
      email,
      ...validatedData
    });

    res.status(201).json({
      success: true,
      data: newTrans
    });
  } catch (err: any) {
    console.error('Create transaction error:', err);
    if (err.name === 'ZodError') {
      res.status(400).json({ success: false, error: 'Validation error', details: err.errors });
    } else {
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  }
});

// GET /v1/api/transactions - Get transactions with filtering & pagination
router.get('/v1/api/transactions', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const queryParams = FilterTransactionsSchema.parse(req.query);
    const email = req.email;

    // Build filter query
    const filter: any = { email };

    if (queryParams.startDate || queryParams.endDate) {
      filter.date = {};
      if (queryParams.startDate) filter.date.$gte = queryParams.startDate;
      if (queryParams.endDate) filter.date.$lte = queryParams.endDate;
    }

    if (queryParams.category) {
      filter.category = queryParams.category;
    }

    if (queryParams.option) {
      filter.option = queryParams.option;
    }

    if (queryParams.minPrice !== undefined || queryParams.maxPrice !== undefined) {
      filter.price = {};
      if (queryParams.minPrice !== undefined) filter.price.$gte = queryParams.minPrice;
      if (queryParams.maxPrice !== undefined) filter.price.$lte = queryParams.maxPrice;
    }

    if (queryParams.search) {
      filter.$or = [
        { name: { $regex: queryParams.search, $options: 'i' } },
        { description: { $regex: queryParams.search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortField = queryParams.sortBy || 'date';
    const sortDirection = queryParams.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = {};
    sortObj[sortField] = sortDirection;

    // Get total count and paginated results
    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort(sortObj as any)
      .limit(queryParams.limit)
      .skip(queryParams.offset)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          total,
          limit: queryParams.limit,
          offset: queryParams.offset,
          pages: Math.ceil(total / queryParams.limit)
        }
      }
    });
  } catch (err: any) {
    console.error('Fetch transactions error:', err);
    if (err.name === 'ZodError') {
      res.status(400).json({ success: false, error: 'Invalid query parameters', details: err.errors });
    } else {
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  }
});

// GET /v1/api/transactions/:id - Get single transaction
router.get('/v1/api/transactions/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const email = req.email;

    const transaction = await Transaction.findOne({ _id: id, email });

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    console.error('Fetch transaction error:', err);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// PATCH /v1/api/transactions/:id - Update transaction
router.patch('/v1/api/transactions/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const email = req.email;

    const validatedData = UpdateTransactionSchema.parse(req.body);

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, email },
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Transaction updated',
      data: transaction
    });
  } catch (err: any) {
    console.error('Update transaction error:', err);
    if (err.name === 'ZodError') {
      res.status(400).json({ success: false, error: 'Validation error', details: err.errors });
    } else {
      res.status(500).json({ error: 'Failed to update transaction' });
    }
  }
});

// DELETE /v1/api/transactions/:id - Delete transaction
router.delete('/v1/api/transactions/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const email = req.email;

    const transaction = await Transaction.findOneAndDelete({ _id: id, email });

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted',
      data: { _id: id }
    });
  } catch (err) {
    console.error('Delete transaction error:', err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

export default router;
