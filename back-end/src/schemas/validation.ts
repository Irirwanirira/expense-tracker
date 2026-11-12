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
  method: z.string().min(1, 'Payment method is required')
});

// Category Schemas
export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').trim()
});

// Export types for TypeScript
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
