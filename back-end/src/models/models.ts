import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

// User Document Interface
export interface IUser extends Document {
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(password: string): Promise<boolean>;
}

// Transaction Document Interface
export interface ITransaction extends Document {
  email: string;
  name: string;
  date: string;
  method: string;
  category?: string;
  price: number;
  option: 'INCOME' | 'EXPENSE';
  description?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Category Document Interface
export interface ICategory extends Document {
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Budget Document Interface
export interface IBudget extends Document {
  email: string;
  category: string;
  limit: number;
  period: 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  spent?: number;
  status?: 'UNDER' | 'WARNING' | 'EXCEEDED';
  createdAt?: Date;
  updatedAt?: Date;
}

// Transaction Schema
const transactionSchema = new Schema<ITransaction>(
  {
    email: { type: String, required: true, index: true },
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
    },
    description: { type: String, trim: true },
    tags: [{ type: String, trim: true }]
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

// Budget Schema
const budgetSchema = new Schema<IBudget>(
  {
    email: { type: String, required: true, index: true },
    category: { type: String, required: true },
    limit: { type: Number, required: true, min: 0 },
    period: {
      type: String,
      required: true,
      enum: ['MONTHLY', 'YEARLY'],
      default: 'MONTHLY'
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    spent: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['UNDER', 'WARNING', 'EXCEEDED'],
      default: 'UNDER'
    }
  },
  { timestamps: true }
);

// User Schema
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true, minlength: 6 }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcryptjs.compare(password, this.password);
};

// Create indexes for better query performance
transactionSchema.index({ email: 1, date: -1 });
transactionSchema.index({ email: 1, category: 1 });
transactionSchema.index({ email: 1, option: 1 });
categorySchema.index({ name: 1 });
userSchema.index({ email: 1 });
budgetSchema.index({ email: 1, category: 1 });
budgetSchema.index({ email: 1, startDate: 1, endDate: 1 });

// Models
export const User = mongoose.model<IUser>('users', userSchema);
export const Transaction = mongoose.model<ITransaction>('transactions', transactionSchema);
export const Category = mongoose.model<ICategory>('categories', categorySchema);
export const Budget = mongoose.model<IBudget>('budgets', budgetSchema);
