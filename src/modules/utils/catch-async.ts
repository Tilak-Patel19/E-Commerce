import { Request, Response, NextFunction } from 'express';

export const errorHandler = (fn: (req: Request, res: Response, next: NextFunction) => any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};
