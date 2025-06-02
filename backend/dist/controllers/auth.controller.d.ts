import { Request, Response } from 'express';
export declare const register: (req: Request, res: Response) => Promise<any>;
export declare const login: (req: Request, res: Response) => Promise<any>;
export declare const refreshToken: (req: Request, res: Response) => Promise<any>;
export declare const logout: (req: Request, res: Response) => Promise<any>;
export declare const registerDriver: (req: Request, res: Response) => Promise<void>;
