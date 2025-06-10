import z from 'zod';
import { JobStatus } from '@prisma/client';

export const createJobDto = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  budget: z.number().optional(),
  status: z
    .enum(['open', 'in_progress', 'closed', 'cancelled'])
    .transform((value) => value.toUpperCase() as JobStatus)
    .default('open'),
  deadline: z.date().optional(),
});

export const getJobDto = z.object({
  id: z.string().regex(/^\d+$/),
});

export const updateJobDto = createJobDto.partial();

export type CreateJobDto = z.infer<typeof createJobDto>;
export type GetJobDto = z.infer<typeof getJobDto>;
export type UpdateJobDto = z.infer<typeof updateJobDto>;
