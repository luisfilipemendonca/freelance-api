import { Proposal, User } from '@prisma/client';
import { CreateProposalDto } from '../dtos/proposals.dto';
import { prisma } from '../lib/prisma';

type CreateProposal = CreateProposalDto & {
  freelancerId: User['id'];
};

type DeleteProposal = {
  id: Proposal['id'];
  freelancerId: Proposal['freelancerId'];
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

  static async delete({ freelancerId, id }: DeleteProposal) {
    const proposal = await this.getProposalById(id);

    // Handle later with custom AppError (sending custom code)
    if (!proposal) throw new Error('No proposal found');

    // Handle later with custom AppError (sending custom code)
    if (proposal.freelancerId !== freelancerId) throw new Error('Not authorized to delete this proposal');

    await prisma.proposal.delete({
      where: {
        id,
      },
    });
  }

  static async getProposalById(id: Proposal['id']) {
    return await prisma.proposal.findUnique({ where: { id } });
  }

  static async getProposalsByFreelancerId(freelancerId: Proposal['freelancerId']) {
    return await prisma.proposal.findMany({ where: { freelancerId } });
  }
}

export default ProposalService;
