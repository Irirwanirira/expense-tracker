import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(password: string): Promise<boolean>;
}
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
export interface ICategory extends Document {
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const Transaction: mongoose.Model<ITransaction, {}, {}, {}, Document<unknown, {}, ITransaction> & ITransaction & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const Category: mongoose.Model<ICategory, {}, {}, {}, Document<unknown, {}, ICategory> & ICategory & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=models.d.ts.map