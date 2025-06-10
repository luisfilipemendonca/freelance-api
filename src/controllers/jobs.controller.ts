import { Response } from 'express';
import { CreateJobDto, DeleteJobDto } from '../dtos/jobs.dto';
import { TypedRequest } from '../types/request';
import { createJob, deleteJobById } from '../services/job.service';
import { HttpStatus } from '../constants/http-codes';

export const create = async (req: TypedRequest<CreateJobDto>, res: Response) => {
  try {
    const user = req.user!;

    const job = await createJob({ ...req.body, clientId: +user.sub });

    res.status(HttpStatus.CREATE_SUCCESS).json({ job });
  } catch (e) {
    console.log(e);
  }
};

export const deleteJob = async (req: TypedRequest<{}, DeleteJobDto>, res: Response) => {
  try {
    const { sub: clientId } = req.user!;
    const { id } = req.params;

    await deleteJobById({ id: +id, clientId: +clientId });

    res.status(HttpStatus.NO_CONTENT).send();
  } catch (e) {
    console.log(e);
  }
};
