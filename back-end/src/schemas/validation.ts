import { z } from 'zod';

// Auth Schemas
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

// Transaction Schemas
export const CreateTransactionSchema = z.object({
  name: z.string().min(1, 'Transaction name is required'),
  date: z.string().min(1, 'Date is required'),
  category: z.string().optional(),
  option: z.enum(['INCOME', 'EXPENSE'], { message: 'Option must be INCOME or EXPENSE' }),
  price: z.number().positive('Price must be greater than 0'),
  method: z.string().min(1, 'Payment method is required'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const UpdateTransactionSchema = z.object({
  name: z.string().min(1).optional(),
  date: z.string().optional(),
  category: z.string().optional(),
  option: z.enum(['INCOME', 'EXPENSE']).optional(),
  price: z.number().positive().optional(),
  method: z.string().min(1).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const FilterTransactionsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.string().optional(),
  option: z.enum(['INCOME', 'EXPENSE']).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().default(50),
  offset: z.number().int().nonnegative().default(0),
  sortBy: z.enum(['date', 'price', 'name']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Category Schemas
export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').trim()
});

// Budget Schemas
export const CreateBudgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  limit: z.number().positive('Budget limit must be greater than 0'),
  period: z.enum(['MONTHLY', 'YEARLY']).default('MONTHLY'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required')
});

export const UpdateBudgetSchema = z.object({
  limit: z.number().positive().optional(),
  period: z.enum(['MONTHLY', 'YEARLY']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

// Report Schemas
export const MonthlyStatementSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().positive(),
  format: z.enum(['json', 'csv', 'pdf']).default('json'),
  detailed: z.boolean().optional()
});

export const ExportTransactionsSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  type: z.enum(['transactions', 'statement']),
  format: z.enum(['csv', 'pdf']),
  pageSize: z.number().int().positive().default(1000),
  page: z.number().int().positive().default(1),
  includeCharts: z.boolean().optional()
});

export const CustomReportSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  reportType: z.enum(['summary', 'detailed', 'comparison']).default('summary'),
  groupBy: z.enum(['category', 'method', 'date']).optional()
});

// Export types for TypeScript
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;
export type FilterTransactionsInput = z.infer<typeof FilterTransactionsSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type CreateBudgetInput = z.infer<typeof CreateBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof UpdateBudgetSchema>;
export type MonthlyStatementInput = z.infer<typeof MonthlyStatementSchema>;
export type ExportTransactionsInput = z.infer<typeof ExportTransactionsSchema>;
export type CustomReportInput = z.infer<typeof CustomReportSchema>;
