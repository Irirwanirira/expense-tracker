import mongoose, { Document } from 'mongoose';
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
export interface ICategory extends Document {
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const Transaction: mongoose.Model<ITransaction, {}, {}, {}, Document<unknown, {}, ITransaction> & ITransaction & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const Category: mongoose.Model<ICategory, {}, {}, {}, Document<unknown, {}, ICategory> & ICategory & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=models.d.ts.map