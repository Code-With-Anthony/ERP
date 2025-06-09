import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({ message: err.message || "Internal Server Error", error: err });
};
