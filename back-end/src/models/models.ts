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
transactionSchema.index({ date: -1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ option: 1 });
transactionSchema.index({ email: 1 });
categorySchema.index({ name: 1 });
userSchema.index({ email: 1 });

// Models
export const User = mongoose.model<IUser>('users', userSchema);
export const Transaction = mongoose.model<ITransaction>('transactions', transactionSchema);
export const Category = mongoose.model<ICategory>('categories', categorySchema);
