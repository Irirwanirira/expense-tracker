import mongoose, { Schema, Document } from 'mongoose';

// Transaction Document Interface
export interface ITransaction extends Document {
  name: string;
  date: string;
  method: string;
  category?: string;
  price: number;
  option: 'INCOME' | 'EXPENSE';
  createdAt?: Date;
  updatedAt?: Date;
}

// Category Document Interface
export interface ICategory extends Document {
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Transaction Schema
const transactionSchema = new Schema<ITransaction>(
  {
    name: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    method: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    option: {
      type: String,
      required: true,
      enum: ['INCOME', 'EXPENSE'],
      default: 'EXPENSE'
    }
  },
  { timestamps: true }
);

// Category Schema
const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, unique: true }
  },
  { timestamps: true }
);

// Create indexes for better query performance
transactionSchema.index({ date: -1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ option: 1 });
categorySchema.index({ name: 1 });

// Models
export const Transaction = mongoose.model<ITransaction>('transactions', transactionSchema);
export const Category = mongoose.model<ICategory>('categories', categorySchema);
