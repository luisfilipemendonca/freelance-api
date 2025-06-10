import { Response } from 'express';
import { CreateJobDto } from '../dtos/jobs.dto';
import { TypedRequest } from '../types/request';
import { createJob } from '../services/job.service';
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
