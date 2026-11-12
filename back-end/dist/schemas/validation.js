"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCategorySchema = exports.CreateTransactionSchema = exports.RefreshTokenSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
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
    method: zod_1.z.string().min(1, 'Payment method is required')
});
// Category Schemas
exports.CreateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Category name is required').trim()
});
//# sourceMappingURL=validation.js.map