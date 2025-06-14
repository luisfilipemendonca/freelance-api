import { User } from '@prisma/client';
import { CreateProposalDto } from '../dtos/proposals.dto';
import { prisma } from '../lib/prisma';

type CreateProposal = CreateProposalDto & {
  freelancerId: User['id'];
};

class ProposalService {
  static async create(data: CreateProposal) {
    return prisma.proposal.create({
      data,
      select: {
        id: true,
        jobId: true,
        coverLetter: true,
        budget: true,
        status: true,
        createdAt: true,
      },
    });
  }
}

export default ProposalService;
