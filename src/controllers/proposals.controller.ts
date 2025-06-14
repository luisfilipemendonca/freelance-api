import { Response } from 'express';
import { CreateProposalDto } from '../dtos/proposals.dto';
import { TypedRequest } from '../types/request';
import ProposalService from '../services/proposal.service';
import { HttpStatus } from '../constants/http-codes';
import { getJobById } from '../services/job.service';

class ProposalsController {
  static async create(req: TypedRequest<CreateProposalDto>, res: Response) {
    try {
      const { sub } = req.user!;
      const job = await getJobById(req.body.jobId);

      if (!job) throw new Error('Job not found');
      if (job.status !== 'OPEN') throw new Error('You can only submit proposals to open jobs');

      const proposal = await ProposalService.create({ ...req.body, freelancerId: +sub });

      res.status(HttpStatus.CREATE_SUCCESS).json({ proposal });
    } catch (e) {
      console.log(e);
    }
  }
}

export default ProposalsController;
