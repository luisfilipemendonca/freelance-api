import { ZodSchema } from 'zod';

export const validateRequestQueryParams = <T extends ZodSchema>(schema: T, query: any) => {
  const parsed = schema.parse(query);
  return parsed;
};
