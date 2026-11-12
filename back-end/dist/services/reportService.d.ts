import { ITransaction } from '../models/models';
interface ReportBreakdown {
    byCategory: Array<{
        category: string;
        expenses: number;
        percentage: number;
    }>;
    byMethod: Array<{
        method: string;
        total: number;
        count: number;
    }>;
    byType: {
        income: number;
        expense: number;
    };
}
interface ReportTrends {
    previousMonth?: {
        totalIncome: number;
        totalExpense: number;
        netSavings: number;
    };
    monthOverMonthChange?: {
        income: number;
        expense: number;
        savings: number;
    };
}
export interface ReportData {
    period: {
        month?: number;
        year?: number;
        startDate: string;
        endDate: string;
    };
    summary: {
        totalIncome: number;
        totalExpense: number;
        netSavings: number;
        transactionCount: number;
    };
    breakdown: ReportBreakdown;
    trends?: ReportTrends;
}
export declare function generateMonthlyStatement(email: string, month: number, year: number, includeComparison?: boolean): Promise<ReportData>;
export declare function generateCustomReport(email: string, startDate: string, endDate: string, _reportType?: 'summary' | 'detailed' | 'comparison'): Promise<ReportData>;
export declare function getTransactionsForExport(email: string, startDate: string, endDate: string, pageSize?: number, page?: number): Promise<{
    transactions: ITransaction[];
    total: number;
    pages: number;
}>;
export declare function validateDateRange(startDate: string, endDate: string): {
    valid: boolean;
    error?: string;
};
export {};
//# sourceMappingURL=reportService.d.ts.map