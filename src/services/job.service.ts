import { Job, User, Prisma } from '@prisma/client';
import { CreateJobDto, ListJobQueryParamsDto, UpdateJobDto } from '../dtos/jobs.dto';
import { prisma } from '../lib/prisma';

type CreateJob = CreateJobDto & {
  clientId: User['id'];
};

type GetJobParams = {
  id: Job['id'];
  clientId: Job['clientId'];
};

type UpdateJobParams = UpdateJobDto & GetJobParams;

export const listAllJobs = async (query: ListJobQueryParamsDto) => {
  const { limit, order, page, sortBy, status, title } = query;

  const where: Prisma.JobWhereInput = {};

  if (status) where.status = status;

  if (title) where.title = { contains: title, mode: 'insensitive' };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      take: +limit,
      skip: (+page - 1) * +limit,
      orderBy: {
        [sortBy]: order,
      },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    data: jobs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / +limit),
    },
  };
};

export const createJob = async (data: CreateJob) => {
  return await prisma.job.create({
    data,
  });
};

export const deleteJobById = async ({ id, clientId }: GetJobParams) => {
  await prisma.job.delete({
    where: {
      id,
      clientId,
    },
  });
};

export const getJobById = async (id: Job['id']) => {
  return await prisma.job.findUnique({
    where: { id },
  });
};

export const updateJobById = async ({ id, clientId, ...rest }: UpdateJobParams) => {
  return await prisma.job.update({
    where: { id, clientId },
    data: { ...rest },
  });
};

export const checkJobOwnership = async ({ id, clientId }: GetJobParams) => {
  const job = await getJobById(id);

  // Handle later with custom AppError (sending custom code)
  if (!job) throw new Error('Job not found');

  if (job.clientId !== clientId) throw new Error('Not authorized to see this job proposals');

  return job;
};
