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
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const UpdateTransactionSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    option: z.ZodOptional<z.ZodEnum<{
        EXPENSE: "EXPENSE";
        INCOME: "INCOME";
    }>>;
    price: z.ZodOptional<z.ZodNumber>;
    method: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const FilterTransactionsSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    option: z.ZodOptional<z.ZodEnum<{
        EXPENSE: "EXPENSE";
        INCOME: "INCOME";
    }>>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodDefault<z.ZodEnum<{
        date: "date";
        name: "name";
        price: "price";
    }>>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export declare const CreateCategorySchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const CreateBudgetSchema: z.ZodObject<{
    category: z.ZodString;
    limit: z.ZodNumber;
    period: z.ZodDefault<z.ZodEnum<{
        MONTHLY: "MONTHLY";
        YEARLY: "YEARLY";
    }>>;
    startDate: z.ZodString;
    endDate: z.ZodString;
}, z.core.$strip>;
export declare const UpdateBudgetSchema: z.ZodObject<{
    limit: z.ZodOptional<z.ZodNumber>;
    period: z.ZodOptional<z.ZodEnum<{
        MONTHLY: "MONTHLY";
        YEARLY: "YEARLY";
    }>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const MonthlyStatementSchema: z.ZodObject<{
    month: z.ZodNumber;
    year: z.ZodNumber;
    format: z.ZodDefault<z.ZodEnum<{
        csv: "csv";
        json: "json";
        pdf: "pdf";
    }>>;
    detailed: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const ExportTransactionsSchema: z.ZodObject<{
    startDate: z.ZodString;
    endDate: z.ZodString;
    type: z.ZodEnum<{
        statement: "statement";
        transactions: "transactions";
    }>;
    format: z.ZodEnum<{
        csv: "csv";
        pdf: "pdf";
    }>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    includeCharts: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const CustomReportSchema: z.ZodObject<{
    startDate: z.ZodString;
    endDate: z.ZodString;
    reportType: z.ZodDefault<z.ZodEnum<{
        comparison: "comparison";
        detailed: "detailed";
        summary: "summary";
    }>>;
    groupBy: z.ZodOptional<z.ZodEnum<{
        category: "category";
        date: "date";
        method: "method";
    }>>;
}, z.core.$strip>;
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
//# sourceMappingURL=validation.d.ts.map