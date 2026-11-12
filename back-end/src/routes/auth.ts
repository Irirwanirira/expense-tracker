import { Router, Request, Response } from 'express';
import { User } from '../models/models';
import { generateTokens, verifyToken } from '../middleware/auth';

const router = Router();

// POST /v1/api/auth/register
router.post('/v1/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
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
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /v1/api/auth/login
router.post('/v1/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
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
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// POST /v1/api/auth/refresh
router.post('/v1/api/auth/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
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
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

export default router;
