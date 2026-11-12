"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_1 = require("../schemas/validation");
const reportService_1 = require("../services/reportService");
const csvExporter_1 = require("../services/csvExporter");
const pdfExporter_1 = require("../services/pdfExporter");
const router = (0, express_1.Router)();
// GET /v1/api/reports/monthly-statement - Generate monthly statement
router.get('/v1/api/reports/monthly-statement', async (req, res) => {
    try {
        const email = req.email;
        const { month, year, format = 'json', detailed = false } = req.query;
        const validatedData = validation_1.MonthlyStatementSchema.parse({
            month: parseInt(month),
            year: parseInt(year),
            format
        });
        const statement = await (0, reportService_1.generateMonthlyStatement)(email, validatedData.month, validatedData.year, detailed);
        if (validatedData.format === 'csv') {
            const csv = (0, csvExporter_1.statementToCSV)(statement);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="statement_${validatedData.year}-${validatedData.month}.csv"`);
            res.send(csv);
            return;
        }
        if (validatedData.format === 'pdf') {
            const pdfStream = (0, pdfExporter_1.generateStatementPDF)(statement, email);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="statement_${validatedData.year}-${validatedData.month}.pdf"`);
            pdfStream.pipe(res);
            return;
        }
        res.status(200).json({
            success: true,
            data: statement
        });
    }
    catch (err) {
        console.error('Monthly statement error:', err);
        if (err.name === 'ZodError') {
            res.status(400).json({ success: false, error: 'Validation error', details: err.errors });
        }
        else {
            res.status(500).json({ error: 'Failed to generate statement' });
        }
    }
});
// POST /v1/api/reports/export/csv - Export transactions as CSV
router.post('/v1/api/reports/export/csv', async (req, res) => {
    try {
        const email = req.email;
        const { startDate, endDate, type, pageSize = 1000, page = 1 } = req.query;
        const validatedData = validation_1.ExportTransactionsSchema.parse({
            startDate: startDate,
            endDate: endDate,
            type: type,
            format: 'csv',
            pageSize: pageSize ? parseInt(pageSize) : 1000,
            page: page ? parseInt(page) : 1
        });
        const dateValidation = (0, reportService_1.validateDateRange)(validatedData.startDate, validatedData.endDate);
        if (!dateValidation.valid) {
            res.status(400).json({ error: dateValidation.error });
            return;
        }
        if (validatedData.type === 'statement') {
            const statement = await (0, reportService_1.generateCustomReport)(email, validatedData.startDate, validatedData.endDate);
            const csv = (0, csvExporter_1.statementToCSV)(statement);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="statement_${validatedData.startDate}_to_${validatedData.endDate}.csv"`);
            res.send(csv);
            return;
        }
        const { transactions, total, pages } = await (0, reportService_1.getTransactionsForExport)(email, validatedData.startDate, validatedData.endDate, validatedData.pageSize, validatedData.page);
        const csv = (0, csvExporter_1.transactionsToCSV)(transactions);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="transactions_${validatedData.startDate}_to_${validatedData.endDate}_page${validatedData.page}.csv"`);
        res.setHeader('X-Total-Records', total.toString());
        res.setHeader('X-Total-Pages', pages.toString());
        res.setHeader('X-Current-Page', validatedData.page.toString());
        res.send(csv);
    }
    catch (err) {
        console.error('CSV export error:', err);
        if (err.name === 'ZodError') {
            res.status(400).json({ success: false, error: 'Validation error', details: err.errors });
        }
        else {
            res.status(500).json({ error: 'Failed to export CSV' });
        }
    }
});
// POST /v1/api/reports/export/pdf - Export report as PDF
router.post('/v1/api/reports/export/pdf', async (req, res) => {
    try {
        const email = req.email;
        const { startDate, endDate, type, includeCharts = false } = req.query;
        const validatedData = validation_1.ExportTransactionsSchema.parse({
            startDate: startDate,
            endDate: endDate,
            type: type,
            format: 'pdf',
            includeCharts: includeCharts === 'true'
        });
        const dateValidation = (0, reportService_1.validateDateRange)(validatedData.startDate, validatedData.endDate);
        if (!dateValidation.valid) {
            res.status(400).json({ error: dateValidation.error });
            return;
        }
        if (validatedData.type === 'statement') {
            const statement = await (0, reportService_1.generateCustomReport)(email, validatedData.startDate, validatedData.endDate);
            const pdfStream = (0, pdfExporter_1.generateStatementPDF)(statement, email);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="statement_${validatedData.startDate}_to_${validatedData.endDate}.pdf"`);
            pdfStream.pipe(res);
            return;
        }
        const { transactions } = await (0, reportService_1.getTransactionsForExport)(email, validatedData.startDate, validatedData.endDate, 50000, 1);
        const pdfStream = (0, pdfExporter_1.generateTransactionsPDF)(transactions, {
            startDate: validatedData.startDate,
            endDate: validatedData.endDate
        });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="transactions_${validatedData.startDate}_to_${validatedData.endDate}.pdf"`);
        pdfStream.pipe(res);
    }
    catch (err) {
        console.error('PDF export error:', err);
        if (err.name === 'ZodError') {
            res.status(400).json({ success: false, error: 'Validation error', details: err.errors });
        }
        else {
            res.status(500).json({ error: 'Failed to export PDF' });
        }
    }
});
// GET /v1/api/reports/custom - Generate custom report
router.get('/v1/api/reports/custom', async (req, res) => {
    try {
        const email = req.email;
        const { startDate, endDate, reportType = 'summary', groupBy } = req.query;
        const validatedData = validation_1.CustomReportSchema.parse({
            startDate: startDate,
            endDate: endDate,
            reportType: reportType || 'summary',
            groupBy: groupBy
        });
        const dateValidation = (0, reportService_1.validateDateRange)(validatedData.startDate, validatedData.endDate);
        if (!dateValidation.valid) {
            res.status(400).json({ error: dateValidation.error });
            return;
        }
        const report = await (0, reportService_1.generateCustomReport)(email, validatedData.startDate, validatedData.endDate, validatedData.reportType);
        res.status(200).json({
            success: true,
            data: report
        });
    }
    catch (err) {
        console.error('Custom report error:', err);
        if (err.name === 'ZodError') {
            res.status(400).json({ success: false, error: 'Validation error', details: err.errors });
        }
        else {
            res.status(500).json({ error: 'Failed to generate custom report' });
        }
    }
});
exports.default = router;
//# sourceMappingURL=reports.js.map