import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@shared/types';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: UserRole;
            };
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const authorize: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => any;
