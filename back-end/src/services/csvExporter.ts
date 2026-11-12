import { stringify } from 'csv-stringify/sync';
import { ITransaction } from '../models/models';
import { ReportData } from './reportService';

export function transactionsToCSV(transactions: ITransaction[]): string {
  const records = transactions.map((t) => [
    t.date,
    t.name,
    t.category || 'Uncategorized',
    t.method,
    t.option,
    t.price.toFixed(2),
    t.description || '',
    t.tags ? t.tags.join('; ') : ''
  ]);

  const output = stringify(records, {
    header: true,
    columns: ['Date', 'Name', 'Category', 'Method', 'Type', 'Amount', 'Description', 'Tags']
  });

  return output;
}

export function statementToCSV(statement: ReportData): string {
  const lines: string[] = [];

  lines.push('MONTHLY FINANCIAL STATEMENT');
  lines.push('');

  const { period, summary, breakdown } = statement;
  lines.push(
    `Period: ${period.month ? `${period.month}/${period.year}` : `${period.startDate} to ${period.endDate}`}`
  );
  lines.push('');

  lines.push('SUMMARY');
  lines.push(`Total Income,${summary.totalIncome.toFixed(2)}`);
  lines.push(`Total Expense,${summary.totalExpense.toFixed(2)}`);
  lines.push(`Net Savings,${summary.netSavings.toFixed(2)}`);
  lines.push(`Transaction Count,${summary.transactionCount}`);
  lines.push('');

  lines.push('EXPENSES BY CATEGORY');
  lines.push('Category,Amount,Percentage');
  breakdown.byCategory.forEach((cat) => {
    lines.push(`${cat.category},${cat.expenses.toFixed(2)},${cat.percentage.toFixed(2)}%`);
  });
  lines.push('');

  lines.push('TRANSACTIONS BY METHOD');
  lines.push('Method,Total,Count');
  breakdown.byMethod.forEach((method) => {
    lines.push(`${method.method},${method.total.toFixed(2)},${method.count}`);
  });

  if (statement.trends) {
    lines.push('');
    lines.push('MONTH-OVER-MONTH COMPARISON');
    lines.push(`Previous Month Income,${statement.trends.previousMonth?.totalIncome.toFixed(2)}`);
    lines.push(`Previous Month Expense,${statement.trends.previousMonth?.totalExpense.toFixed(2)}`);
    lines.push(`Income Change,${statement.trends.monthOverMonthChange?.income.toFixed(2)}%`);
    lines.push(`Expense Change,${statement.trends.monthOverMonthChange?.expense.toFixed(2)}%`);
    lines.push(`Savings Change,${statement.trends.monthOverMonthChange?.savings.toFixed(2)}%`);
  }

  return lines.join('\n');
}
