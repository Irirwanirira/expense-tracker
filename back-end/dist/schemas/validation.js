"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCategorySchema = exports.FilterTransactionsSchema = exports.UpdateTransactionSchema = exports.CreateTransactionSchema = exports.RefreshTokenSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
// Auth Schemas
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters')
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required')
});
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required')
});
// Transaction Schemas
exports.CreateTransactionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Transaction name is required'),
    date: zod_1.z.string().min(1, 'Date is required'),
    category: zod_1.z.string().optional(),
    option: zod_1.z.enum(['INCOME', 'EXPENSE'], { message: 'Option must be INCOME or EXPENSE' }),
    price: zod_1.z.number().positive('Price must be greater than 0'),
    method: zod_1.z.string().min(1, 'Payment method is required'),
    description: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional()
});
exports.UpdateTransactionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    date: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    option: zod_1.z.enum(['INCOME', 'EXPENSE']).optional(),
    price: zod_1.z.number().positive().optional(),
    method: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional()
});
exports.FilterTransactionsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    option: zod_1.z.enum(['INCOME', 'EXPENSE']).optional(),
    minPrice: zod_1.z.number().optional(),
    maxPrice: zod_1.z.number().optional(),
    search: zod_1.z.string().optional(),
    limit: zod_1.z.number().int().positive().default(50),
    offset: zod_1.z.number().int().nonnegative().default(0),
    sortBy: zod_1.z.enum(['date', 'price', 'name']).default('date'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc')
});
// Category Schemas
exports.CreateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Category name is required').trim()
});
//# sourceMappingURL=validation.js.map