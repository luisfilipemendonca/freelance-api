import { User } from '@prisma/client';
import { CreateJobDto } from '../dtos/jobs.dto';
import { prisma } from '../lib/prisma';

type CreateJob = CreateJobDto & {
  clientId: User['id'];
};

export const createJob = async (data: CreateJob) => {
  return await prisma.job.create({
    data,
  });
};
