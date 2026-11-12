import { Readable } from 'stream';
import { ITransaction } from '../models/models';
import { ReportData } from './reportService';
export declare function generateStatementPDF(statement: ReportData, userEmail: string): Readable;
export declare function generateTransactionsPDF(transactions: ITransaction[], dateRange: {
    startDate: string;
    endDate: string;
}): Readable;
//# sourceMappingURL=pdfExporter.d.ts.map