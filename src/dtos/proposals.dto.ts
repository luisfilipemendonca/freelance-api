import z from 'zod';

export const createProposalDto = z.object({
  jobId: z.coerce.number(),
  coverLetter: z.string(),
  budget: z.coerce.number(),
});

export const getProposalParamsDto = z.object({
  id: z.coerce.number().transform((value) => `${value}`),
});

export type CreateProposalDto = z.infer<typeof createProposalDto>;
export type GetProposalParamsDto = z.infer<typeof getProposalParamsDto>;
