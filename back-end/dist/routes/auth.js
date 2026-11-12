"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models/models");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../schemas/validation");
const router = (0, express_1.Router)();
// POST /v1/api/auth/register
router.post('/v1/api/auth/register', async (req, res) => {
    try {
        const validatedData = validation_1.RegisterSchema.parse(req.body);
        const { email, password } = validatedData;
        // Check if user exists
        const existingUser = await models_1.User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }
        // Create user
        const newUser = await models_1.User.create({
            email: email.toLowerCase(),
            password
        });
        // Generate tokens
        const { accessToken, refreshToken } = (0, auth_1.generateTokens)(newUser.email);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                email: newUser.email,
                accessToken,
                refreshToken
            }
        });
    }
    catch (err) {
        console.error('Register error:', err);
        if (err.name === 'ZodError') {
            res.status(400).json({
                success: false,
                error: 'Validation error',
                details: err.errors
            });
        }
        else {
            res.status(500).json({ error: 'Failed to register user' });
        }
    }
});
// POST /v1/api/auth/login
router.post('/v1/api/auth/login', async (req, res) => {
    try {
        const validatedData = validation_1.LoginSchema.parse(req.body);
        const { email, password } = validatedData;
        // Find user
        const user = await models_1.User.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Generate tokens
        const { accessToken, refreshToken } = (0, auth_1.generateTokens)(user.email);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                email: user.email,
                accessToken,
                refreshToken
            }
        });
    }
    catch (err) {
        console.error('Login error:', err);
        if (err.name === 'ZodError') {
            res.status(400).json({
                success: false,
                error: 'Validation error',
                details: err.errors
            });
        }
        else {
            res.status(500).json({ error: 'Failed to login' });
        }
    }
});
// POST /v1/api/auth/refresh
router.post('/v1/api/auth/refresh', async (req, res) => {
    try {
        const validatedData = validation_1.RefreshTokenSchema.parse(req.body);
        const { refreshToken } = validatedData;
        const decoded = (0, auth_1.verifyToken)(refreshToken);
        if (!decoded) {
            res.status(401).json({ error: 'Invalid or expired refresh token' });
            return;
        }
        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = (0, auth_1.generateTokens)(decoded.email);
        res.status(200).json({
            success: true,
            data: {
                accessToken,
                refreshToken: newRefreshToken
            }
        });
    }
    catch (err) {
        console.error('Refresh token error:', err);
        if (err.name === 'ZodError') {
            res.status(400).json({
                success: false,
                error: 'Validation error',
                details: err.errors
            });
        }
        else {
            res.status(500).json({ error: 'Failed to refresh token' });
        }
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map