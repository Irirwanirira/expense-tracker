import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    email?: string;
    userId?: string;
}
export declare const generateTokens: (email: string) => {
    accessToken: string;
    refreshToken: string;
};
export declare const verifyToken: (token: string) => {
    email: string;
} | null;
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map