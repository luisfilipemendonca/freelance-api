import { Response } from 'express';
import { CreateJobDto, GetJobDto, listJobQueryParamsDto, ListJobQueryParamsDto, UpdateJobDto } from '../dtos/jobs.dto';
import { TypedRequest } from '../types/request';
import { createJob, deleteJobById, getJobById, listAllJobs, updateJobById } from '../services/job.service';
import { HttpStatus } from '../constants/http-codes';
import { validateRequestQueryParams } from '../middlewares/validateRequestQueryParams';

export const listJobs = async (req: TypedRequest<{}, {}, ListJobQueryParamsDto>, res: Response) => {
  try {
    const parsedQueryParams = validateRequestQueryParams(listJobQueryParamsDto, req.query);
    const jobs = await listAllJobs(parsedQueryParams);

    res.status(HttpStatus.READ_SUCCESS).json({ jobs });
  } catch (error) {
    console.log(error);
  }
};

export const create = async (req: TypedRequest<CreateJobDto>, res: Response) => {
  try {
    const user = req.user!;

    const job = await createJob({ ...req.body, clientId: +user.sub });

    res.status(HttpStatus.CREATE_SUCCESS).json({ job });
  } catch (e) {
    console.log(e);
  }
};

export const deleteJob = async (req: TypedRequest<{}, GetJobDto>, res: Response) => {
  try {
    const { sub: clientId } = req.user!;
    const { id } = req.params;

    await deleteJobById({ id: +id, clientId: +clientId });

    res.status(HttpStatus.NO_CONTENT).send();
  } catch (e) {
    console.log(e);
  }
};

export const getJob = async (req: TypedRequest<{}, GetJobDto>, res: Response) => {
  try {
    const { id } = req.params;

    const job = await getJobById(+id);

    if (!job) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Job not found' });
      return;
    }

    res.status(HttpStatus.READ_SUCCESS).json({ job });
  } catch (e) {
    console.log(e);
  }
};

export const updateJob = async (req: TypedRequest<UpdateJobDto, GetJobDto>, res: Response) => {
  try {
    const { id } = req.params;
    const { sub: clientId } = req.user!;

    const job = await updateJobById({ id: +id, clientId: +clientId, ...req.body });

    res.status(HttpStatus.READ_SUCCESS).json({ job });
  } catch (e) {
    console.log(e);
  }
};
