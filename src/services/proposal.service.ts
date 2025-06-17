import { Job, Prisma, Proposal, ProposalStatus, User } from '@prisma/client';
import { CreateProposalDto } from '../dtos/proposals.dto';
import { prisma } from '../lib/prisma';
import { ContractService } from './contract.service';

type CreateProposal = CreateProposalDto & {
  freelancerId: User['id'];
};

type DeleteProposal = {
  id: Proposal['id'];
  freelancerId: Proposal['freelancerId'];
};

type UpdateProposal = {
  id: Proposal['id'];
  data: Partial<Omit<Proposal, 'id'>>;
  tx: Prisma.TransactionClient;
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

  static async getProposalById(id: Proposal['id'], includeJob = false) {
    let jobInclude: Prisma.ProposalInclude = {};

    if (includeJob) {
      jobInclude = {
        job: {
          select: {
            id: true,
            clientId: true,
          },
        },
      };
    }

    return await prisma.proposal.findUnique({ where: { id }, include: jobInclude });
  }

  static async accept(id: Proposal['id'], clientId: Job['clientId']) {
    const proposal = await this.getProposalById(id, true);

    // handle 404 later
    if (!proposal) throw new Error('Proposal not found');

    // handle 403 later
    if (clientId !== proposal.job.clientId) throw new Error('Not authorized to accept this proposal');

    if (proposal.status !== 'PENDING') throw new Error('This proposal cannot be accepted');

    return await prisma.$transaction(async (tx) => {
      await this.updateProposalById({ id, data: { status: ProposalStatus.ACCEPTED }, tx });

      return await ContractService.create({
        tx,
        data: {
          jobId: proposal.jobId,
          clientId,
          freelancerId: proposal.freelancerId,
          terms: 'Some terms',
        },
      });
    });
  }

  static async getProposalsByFreelancerId(freelancerId: Proposal['freelancerId']) {
    return await prisma.proposal.findMany({ where: { freelancerId } });
  }

  static async getProposalsByJobId(jobId: Proposal['jobId']) {
    return await prisma.proposal.findMany({
      where: { jobId },
      include: {
        freelancer: {
          select: { id: true, email: true, username: true },
        },
      },
    });
  }

  static async updateProposalById({ data, id, tx }: UpdateProposal) {
    return await tx.proposal.update({
      where: { id },
      data,
    });
  }
}

export default ProposalService;
