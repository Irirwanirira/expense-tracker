import { Router, Response } from 'express';
import { User } from '../models/models';
import { generateTokens, verifyToken, AuthRequest } from '../middleware/auth';
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from '../schemas/validation';

const router = Router();

// POST /v1/api/auth/register
router.post('/v1/api/auth/register', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = RegisterSchema.parse(req.body);
    const { email, password } = validatedData;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    // Create user
    const newUser = await User.create({
      email: email.toLowerCase(),
      password
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser.email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        email: newUser.email,
        accessToken,
        refreshToken
      }
    });
  } catch (err: any) {
    console.error('Register error:', err);
    if (err.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: err.errors
      });
    } else {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
});

// POST /v1/api/auth/login
router.post('/v1/api/auth/login', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = LoginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
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
    const { accessToken, refreshToken } = generateTokens(user.email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        email: user.email,
        accessToken,
        refreshToken
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    if (err.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: err.errors
      });
    } else {
      res.status(500).json({ error: 'Failed to login' });
    }
  }
});

// POST /v1/api/auth/refresh
router.post('/v1/api/auth/refresh', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = RefreshTokenSchema.parse(req.body);
    const { refreshToken } = validatedData;

    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      res.status(401).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.email);

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (err: any) {
    console.error('Refresh token error:', err);
    if (err.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: err.errors
      });
    } else {
      res.status(500).json({ error: 'Failed to refresh token' });
    }
  }
});

export default router;
