import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MonthlyStatementSchema, ExportTransactionsSchema, CustomReportSchema } from '../schemas/validation';
import { generateMonthlyStatement, generateCustomReport, getTransactionsForExport, validateDateRange } from '../services/reportService';
import { transactionsToCSV, statementToCSV } from '../services/csvExporter';
import { generateStatementPDF, generateTransactionsPDF } from '../services/pdfExporter';

const router = Router();

// GET /v1/api/reports/monthly-statement - Generate monthly statement
router.get('/v1/api/reports/monthly-statement', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const email = req.email!;
    const { month, year, format = 'json', detailed = false } = req.query;

    const validatedData = MonthlyStatementSchema.parse({
      month: parseInt(month as string),
      year: parseInt(year as string),
      format
    });

    const statement = await generateMonthlyStatement(email, validatedData.month, validatedData.year, detailed as boolean);

    if (validatedData.format === 'csv') {
      const csv = statementToCSV(statement);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="statement_${validatedData.year}-${validatedData.month}.csv"`);
      res.send(csv);
      return;
    }

    if (validatedData.format === 'pdf') {
      const pdfStream = generateStatementPDF(statement, email);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="statement_${validatedData.year}-${validatedData.month}.pdf"`);
      pdfStream.pipe(res);
      return;
    }

    res.status(200).json({
      success: true,
      data: statement
    });
  } catch (err: any) {
    console.error('Monthly statement error:', err);
    if (err.name === 'ZodError') {
      res.status(400).json({ success: false, error: 'Validation error', details: err.errors });
    } else {
      res.status(500).json({ error: 'Failed to generate statement' });
    }
  }
});

// POST /v1/api/reports/export/csv - Export transactions as CSV
router.post('/v1/api/reports/export/csv', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const email = req.email!;
    const { startDate, endDate, type, pageSize = 1000, page = 1 } = req.query;

    const validatedData = ExportTransactionsSchema.parse({
      startDate: startDate as string,
      endDate: endDate as string,
      type: type as string,
      format: 'csv',
      pageSize: pageSize ? parseInt(pageSize as string) : 1000,
      page: page ? parseInt(page as string) : 1
    });

    const dateValidation = validateDateRange(validatedData.startDate, validatedData.endDate);
    if (!dateValidation.valid) {
      res.status(400).json({ error: dateValidation.error });
      return;
    }

    if (validatedData.type === 'statement') {
      const statement = await generateCustomReport(email, validatedData.startDate, validatedData.endDate);
      const csv = statementToCSV(statement);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="statement_${validatedData.startDate}_to_${validatedData.endDate}.csv"`);
      res.send(csv);
      return;
    }

    const { transactions, total, pages } = await getTransactionsForExport(
      email,
      validatedData.startDate,
      validatedData.endDate,
      validatedData.pageSize,
      validatedData.page
    );

    const csv = transactionsToCSV(transactions);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="transactions_${validatedData.startDate}_to_${validatedData.endDate}_page${validatedData.page}.csv"`);
    res.setHeader('X-Total-Records', total.toString());
    res.setHeader('X-Total-Pages', pages.toString());
    res.setHeader('X-Current-Page', validatedData.page.toString());

    res.send(csv);
  } catch (err: any) {
    console.error('CSV export error:', err);
    if (err.name === 'ZodError') {
      res.status(400).json({ success: false, error: 'Validation error', details: err.errors });
    } else {
      res.status(500).json({ error: 'Failed to export CSV' });
    }
  }
});

// POST /v1/api/reports/export/pdf - Export report as PDF
router.post('/v1/api/reports/export/pdf', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const email = req.email!;
    const { startDate, endDate, type, includeCharts = false } = req.query;

    const validatedData = ExportTransactionsSchema.parse({
      startDate: startDate as string,
      endDate: endDate as string,
      type: type as string,
      format: 'pdf',
      includeCharts: includeCharts === 'true'
    });

    const dateValidation = validateDateRange(validatedData.startDate, validatedData.endDate);
    if (!dateValidation.valid) {
      res.status(400).json({ error: dateValidation.error });
      return;
    }

    if (validatedData.type === 'statement') {
      const statement = await generateCustomReport(email, validatedData.startDate, validatedData.endDate);
      const pdfStream = generateStatementPDF(statement, email);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="statement_${validatedData.startDate}_to_${validatedData.endDate}.pdf"`);

      pdfStream.pipe(res);
      return;
    }

    const { transactions } = await getTransactionsForExport(email, validatedData.startDate, validatedData.endDate, 50000, 1);

    const pdfStream = generateTransactionsPDF(transactions, {
      startDate: validatedData.startDate,
      endDate: validatedData.endDate
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="transactions_${validatedData.startDate}_to_${validatedData.endDate}.pdf"`);

    pdfStream.pipe(res);
  } catch (err: any) {
    console.error('PDF export error:', err);
    if (err.name === 'ZodError') {
      res.status(400).json({ success: false, error: 'Validation error', details: err.errors });
    } else {
      res.status(500).json({ error: 'Failed to export PDF' });
    }
  }
});

// GET /v1/api/reports/custom - Generate custom report
router.get('/v1/api/reports/custom', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const email = req.email!;
    const { startDate, endDate, reportType = 'summary', groupBy } = req.query;

    const validatedData = CustomReportSchema.parse({
      startDate: startDate as string,
      endDate: endDate as string,
      reportType: (reportType as string) || 'summary',
      groupBy: groupBy as string | undefined
    });

    const dateValidation = validateDateRange(validatedData.startDate, validatedData.endDate);
    if (!dateValidation.valid) {
      res.status(400).json({ error: dateValidation.error });
      return;
    }

    const report = await generateCustomReport(email, validatedData.startDate, validatedData.endDate, validatedData.reportType);

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (err: any) {
    console.error('Custom report error:', err);
    if (err.name === 'ZodError') {
      res.status(400).json({ success: false, error: 'Validation error', details: err.errors });
    } else {
      res.status(500).json({ error: 'Failed to generate custom report' });
    }
  }
});

export default router;
