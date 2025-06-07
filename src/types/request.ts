import { Request } from 'express';

export type TypedRequest<T extends Record<string, any>> = Request<{}, {}, T>;
