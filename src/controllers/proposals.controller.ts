import { Request, Response } from 'express';
import { CreateProposalDto, GetProposalParamsDto } from '../dtos/proposals.dto';
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

  static async delete(req: TypedRequest<{}, GetProposalParamsDto>, res: Response) {
    try {
      const { sub } = req.user!;

      await ProposalService.delete({ id: +req.params.id, freelancerId: +sub });

      res.status(HttpStatus.NO_CONTENT).send();
    } catch (e) {
      console.log(e);
    }
  }

  static async index(req: Request, res: Response) {
    try {
      const { sub } = req.user!;

      const proposals = await ProposalService.getProposalsByFreelancerId(+sub);

      res.status(HttpStatus.READ_SUCCESS).json({ proposals });
    } catch (e) {
      console.log(e);
    }
  }

  static async accept(req: TypedRequest<{}, GetProposalParamsDto>, res: Response) {
    try {
      const { id } = req.params;
      const { sub } = req.user!;

      const contract = await ProposalService.accept(+id, +sub);

      res.status(HttpStatus.CREATE_SUCCESS).json({ contract });
    } catch (e) {
      console.log(e);
    }
  }
}

export default ProposalsController;
