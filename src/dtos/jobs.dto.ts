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

export const listJobQueryParamsDto = z.object({
  title: z.string().min(1).optional(),
  status: z
    .enum(['open', 'in_progress', 'closed', 'cancelled'])
    .transform((value) => value.toUpperCase() as JobStatus)
    .optional(),
  sortBy: z.enum(['createdAt', 'budget', 'deadline']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().min(1).default(1).transform(String),
  limit: z.coerce.number().min(1).max(100).default(10).transform(String),
});

export type CreateJobDto = z.infer<typeof createJobDto>;
export type GetJobDto = z.infer<typeof getJobDto>;
export type UpdateJobDto = z.infer<typeof updateJobDto>;
export type ListJobQueryParamsDto = z.infer<typeof listJobQueryParamsDto>;
