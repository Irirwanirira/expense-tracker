"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const transactionsEnhanced_1 = __importDefault(require("./routes/transactionsEnhanced"));
const auth_1 = __importDefault(require("./routes/auth"));
const auth_2 = require("./middleware/auth");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;
if (!DB_URL) {
    console.error('❌ ERROR: DB_URL environment variable is not set');
    process.exit(1);
}
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Public Routes
app.use(auth_1.default);
// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});
// Protected Routes (require authentication)
app.use(auth_2.authMiddleware);
app.use(transactionsEnhanced_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
// Database connection and server startup
mongoose_1.default
    .connect(DB_URL)
    .then(() => {
    app.listen(PORT, () => {
        console.log(`✓ Server running on http://localhost:${PORT}`);
        console.log(`✓ Database connected`);
    });
})
    .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
});
//# sourceMappingURL=index.js.map