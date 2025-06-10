import { Job, User } from '@prisma/client';
import { CreateJobDto, UpdateJobDto } from '../dtos/jobs.dto';
import { prisma } from '../lib/prisma';

type CreateJob = CreateJobDto & {
  clientId: User['id'];
};

type GetJobParams = {
  id: Job['id'];
  clientId: Job['clientId'];
};

type UpdateJobParams = UpdateJobDto & GetJobParams;

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
