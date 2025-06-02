import { Request, Response } from 'express';
export declare const requestRide: (req: Request, res: Response) => Promise<any>;
export declare const acceptRide: (req: Request, res: Response) => Promise<any>;
export declare const driverArrived: (req: Request, res: Response) => Promise<any>;
export declare const startRide: (req: Request, res: Response) => Promise<any>;
export declare const completeRide: (req: Request, res: Response) => Promise<any>;
export declare const cancelRide: (req: Request, res: Response) => Promise<any>;
export declare const getRideById: (req: Request, res: Response) => Promise<any>;
export declare const getUserRides: (req: Request, res: Response) => Promise<any>;
