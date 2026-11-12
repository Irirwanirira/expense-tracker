import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import { ITransaction } from '../models/models';
import { ReportData } from './reportService';

export function generateStatementPDF(statement: ReportData, userEmail: string): Readable {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  doc.fontSize(20).font('Helvetica-Bold').text('Monthly Financial Statement', { align: 'center' });
  doc.moveDown(0.5);

  const { period, summary, breakdown, trends } = statement;
  const periodStr = period.month ? `${period.month}/${period.year}` : `${period.startDate} to ${period.endDate}`;

  doc.fontSize(10).font('Helvetica').text(`Period: ${periodStr}`, { align: 'center' });
  doc.text(`User: ${userEmail}`, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
  doc.moveDown(1);

  doc.fontSize(14).font('Helvetica-Bold').text('Summary');
  doc.moveDown(0.3);
  doc.fontSize(10).font('Helvetica');
  doc.text(`Total Income: $${summary.totalIncome.toFixed(2)}`);
  doc.text(`Total Expense: $${summary.totalExpense.toFixed(2)}`);
  doc.text(`Net Savings: $${summary.netSavings.toFixed(2)}`);
  doc.text(`Total Transactions: ${summary.transactionCount}`);
  doc.moveDown(1);

  doc.fontSize(14).font('Helvetica-Bold').text('Expenses by Category');
  doc.moveDown(0.3);
  doc.fontSize(9).font('Helvetica');

  breakdown.byCategory.slice(0, 10).forEach((cat) => {
    const bar = '█'.repeat(Math.floor(cat.percentage / 2));
    doc.text(`${cat.category.padEnd(20)} $${cat.expenses.toFixed(2).padStart(10)} ${bar} ${cat.percentage.toFixed(1)}%`);
  });

  if (breakdown.byCategory.length > 10) {
    doc.text(`... and ${breakdown.byCategory.length - 10} more categories`);
  }
  doc.moveDown(1);

  doc.fontSize(14).font('Helvetica-Bold').text('Transactions by Method');
  doc.moveDown(0.3);
  doc.fontSize(9).font('Helvetica');

  breakdown.byMethod.slice(0, 8).forEach((method) => {
    doc.text(`${method.method.padEnd(20)} $${method.total.toFixed(2).padStart(10)} (${method.count} transactions)`);
  });

  if (breakdown.byMethod.length > 8) {
    doc.text(`... and ${breakdown.byMethod.length - 8} more methods`);
  }
  doc.moveDown(1);

  if (trends && trends.monthOverMonthChange) {
    doc.fontSize(14).font('Helvetica-Bold').text('Month-over-Month Changes');
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica');

    const incomeChange = trends.monthOverMonthChange.income;
    const expenseChange = trends.monthOverMonthChange.expense;
    const savingsChange = trends.monthOverMonthChange.savings;

    doc.text(`Income: ${incomeChange >= 0 ? '+' : ''}${incomeChange.toFixed(2)}%`);
    doc.text(`Expense: ${expenseChange >= 0 ? '+' : ''}${expenseChange.toFixed(2)}%`);
    doc.text(`Savings: ${savingsChange >= 0 ? '+' : ''}${savingsChange.toFixed(2)}%`);
  }

  doc.end();
  return doc;
}

export function generateTransactionsPDF(
  transactions: ITransaction[],
  dateRange: { startDate: string; endDate: string }
): Readable {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  doc.fontSize(18).font('Helvetica-Bold').text('Transaction Report', { align: 'center' });
  doc.moveDown(0.3);

  doc.fontSize(10).font('Helvetica').text(`Period: ${dateRange.startDate} to ${dateRange.endDate}`, {
    align: 'center'
  });
  doc.text(`Total Transactions: ${transactions.length}`, { align: 'center' });
  doc.moveDown(1);

  doc.fontSize(9).font('Helvetica-Bold');
  const headerY = doc.y;
  doc.text('Date', 50);
  doc.text('Name', 100);
  doc.text('Category', 180);
  doc.text('Amount', 280);
  doc.text('Type', 330);

  doc.moveTo(50, headerY + 12).lineTo(550, headerY + 12).stroke();
  doc.moveDown(1);

  doc.fontSize(8).font('Helvetica');

  transactions.slice(0, 100).forEach((t) => {
    const y = doc.y;

    if (y > 750) {
      doc.addPage();
      doc.fontSize(8).font('Helvetica');
    }

    doc.text(t.date, 50, undefined, { width: 40 });
    doc.text(t.name, 100, y, { width: 70 });
    doc.text(t.category || 'Uncategorized', 180, y, { width: 90 });
    doc.text(`$${t.price.toFixed(2)}`, 280, y, { width: 45, align: 'right' });
    doc.text(t.option, 330, y, { width: 50 });

    doc.moveTo(50, y + 12).lineTo(550, y + 12).stroke('lightgray');
    doc.moveDown(1);
  });

  if (transactions.length > 100) {
    doc.moveDown(0.5);
    doc.text(`... and ${transactions.length - 100} more transactions (see CSV export for complete list)`);
  }

  doc.end();
  return doc;
}
