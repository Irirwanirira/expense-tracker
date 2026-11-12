import { Router, Request, Response } from 'express';
import { Transaction, Category } from '../models/models';

const router = Router();

// POST /v1/api/transactions
router.post('/v1/api/transactions', async (req: Request, res: Response) => {
  try {
    const { name, date, category, option, price, method } = req.body;

    if (!name || !date || !option || price === undefined || !method) {
      return res.status(400).json({
        error: 'Missing required fields: name, date, option, price, method'
      });
    }

    const newTrans = await Transaction.create({
      name,
      date,
      category,
      option,
      price,
      method
    });

    res.status(201).json({
      success: true,
      data: {
        _id: newTrans._id,
        name: newTrans.name,
        price: newTrans.price,
        date: newTrans.date,
        method: newTrans.method,
        category: newTrans.category,
        option: newTrans.option
      }
    });
  } catch (err) {
    console.error('Create transaction error:', err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// GET /v1/api/transactions
router.get('/v1/api/transactions', async (_req: Request, res: Response) => {
  try {
    const allTrans = await Transaction.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      data: allTrans
    });
  } catch (err) {
    console.error('Fetch transactions error:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// DELETE /v1/api/transactions/:id
router.delete('/v1/api/transactions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    const deletedTrans = await Transaction.findByIdAndDelete(id);

    if (!deletedTrans) {
      return res.status(404).json({ error: 'Transaction not found' });
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

// POST /v1/api/categories
router.post('/v1/api/categories', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ error: 'Category already exists' });
    }

    const newCategory = await Category.create({ name: name.trim() });
    res.status(201).json({
      success: true,
      data: { _id: newCategory._id, name: newCategory.name }
    });
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// GET /v1/api/categories
router.get('/v1/api/categories', async (_req: Request, res: Response) => {
  try {
    const allCategories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: allCategories
    });
  } catch (err) {
    console.error('Fetch categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// DELETE /v1/api/categories/:id
router.delete('/v1/api/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted',
      data: { _id: id }
    });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
