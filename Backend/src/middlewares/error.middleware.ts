import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof ZodError) {
        res.status(400).json({ error: 'Validation Error', details: err.issues });
        return;
    }
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
};
