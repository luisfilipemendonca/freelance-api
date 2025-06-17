import { Contract, Prisma } from '@prisma/client';

type CreateContract = {
  tx: Prisma.TransactionClient;
  data: Pick<Contract, 'clientId' | 'freelancerId' | 'jobId' | 'terms'>;
};

export class ContractService {
  static async create({ tx, data }: CreateContract) {
    return await tx.contract.create({ data });
  }
}
