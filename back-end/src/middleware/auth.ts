import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  email?: string;
  userId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateTokens = (email: string): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): { email: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return decoded;
  } catch {
    return null;
  }
};

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    req.email = decoded.email;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Authentication error' });
  }
};
