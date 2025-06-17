import { z } from 'zod';

export const getContractParams = z.object({
  id: z.coerce.number().transform((value) => `${value}`),
});

export type GetContractParamsDto = z.infer<typeof getContractParams>;
