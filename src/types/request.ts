import { Request } from 'express';

export type TypedRequest<B extends {} = {}, P extends {} = {}, Q extends {} = {}> = Request<P, {}, B, Q>;
