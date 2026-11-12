"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Budget = exports.Category = exports.Transaction = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Transaction Schema
const transactionSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
// Category Schema
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, unique: true }
}, { timestamps: true });
// Budget Schema
const budgetSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
// User Schema
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true, minlength: 6 }
}, { timestamps: true });
// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (err) {
        next(err);
    }
});
// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
    return bcryptjs_1.default.compare(password, this.password);
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
exports.User = mongoose_1.default.model('users', userSchema);
exports.Transaction = mongoose_1.default.model('transactions', transactionSchema);
exports.Category = mongoose_1.default.model('categories', categorySchema);
exports.Budget = mongoose_1.default.model('budgets', budgetSchema);
//# sourceMappingURL=models.js.map