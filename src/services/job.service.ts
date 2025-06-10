import { Job, User } from '@prisma/client';
import { CreateJobDto } from '../dtos/jobs.dto';
import { prisma } from '../lib/prisma';

type CreateJob = CreateJobDto & {
  clientId: User['id'];
};

type DeleteJob = {
  id: Job['id'];
  clientId: Job['clientId'];
};

export const createJob = async (data: CreateJob) => {
  return await prisma.job.create({
    data,
  });
};

export const deleteJobById = async ({ id, clientId }: DeleteJob) => {
  await prisma.job.delete({
    where: {
      id,
      clientId,
    },
  });
};
