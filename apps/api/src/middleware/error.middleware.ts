import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

export const errorMiddleware = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: message,
        code: err.code,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path,
    });
};
