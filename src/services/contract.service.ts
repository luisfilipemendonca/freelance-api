import { Contract, ContractStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import ProposalService from './proposal.service';

type CreateContract = {
  tx: Prisma.TransactionClient;
  data: Pick<Contract, 'clientId' | 'freelancerId' | 'jobId' | 'terms'>;
};

type UpdateContract = {
  id: Contract['id'];
  data: Partial<Omit<Contract, 'id'>>;
};

export class ContractService {
  static async create({ tx, data }: CreateContract) {
    return await tx.contract.create({ data });
  }

  static async accept(id: Contract['id'], freelancerId: Contract['freelancerId']) {
    const contract = await this.getContractById(id);

    if (!contract) throw new Error('Contract not found');
    if (contract.freelancerId !== freelancerId) throw new Error('Not authorized to accept this contract');

    return await prisma.$transaction(async (tx) => {
      await this.updateContractById({ id, data: { status: ContractStatus.ACTIVE } });
      await ProposalService.rejectProposals(contract.jobId, tx);
    });
  }

  static async getContractById(id: Contract['id']) {
    return await prisma.contract.findUnique({
      where: { id },
    });
  }

  static async updateContractById({ id, data }: UpdateContract) {
    await prisma.contract.update({
      where: { id },
      data,
    });
  }
}
