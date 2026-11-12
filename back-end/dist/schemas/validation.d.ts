import { z } from 'zod';
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strip>;
export declare const CreateTransactionSchema: z.ZodObject<{
    name: z.ZodString;
    date: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    option: z.ZodEnum<{
        EXPENSE: "EXPENSE";
        INCOME: "INCOME";
    }>;
    price: z.ZodNumber;
    method: z.ZodString;
}, z.core.$strip>;
export declare const CreateCategorySchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
//# sourceMappingURL=validation.d.ts.map