"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
const errorHandler = (err, _req, res, _next) => {
    console.error('Error:', err);
    // Zod validation errors
    if (err instanceof zod_1.ZodError) {
        const errors = err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
        }));
        res.status(400).json({
            success: false,
            error: 'Validation error',
            details: errors
        });
        return;
    }
    // Custom app errors
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message
        });
        return;
    }
    // Default server error
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map