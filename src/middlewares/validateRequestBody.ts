import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validateRequestBody =
  <T extends ZodSchema>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.errors });
        return;
      }

      next(error);
    }
  };
