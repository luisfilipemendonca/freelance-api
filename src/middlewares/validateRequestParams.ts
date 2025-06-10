import { ZodError, ZodSchema } from 'zod';
import { HttpStatus } from '../constants/http-codes';
import { NextFunction, Request, Response } from 'express';

export const validateRequestParams =
  <T extends ZodSchema>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.params);
      req.params = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(HttpStatus.VALIDATION_ERROR).json({ errors: error.errors });
        return;
      }

      next(error);
    }
  };
