import { Response } from 'express';
import { TypedRequest } from '../types/request';
import { GetContractParamsDto } from '../dtos/contracts.dto';
import { ContractService } from '../services/contract.service';
import { HttpStatus } from '../constants/http-codes';

class ContractsController {
  static async accept(req: TypedRequest<{}, GetContractParamsDto>, res: Response) {
    const { sub } = req.user!;
    const { id } = req.params;

    await ContractService.accept(+id, +sub);

    res.status(HttpStatus.CREATE_SUCCESS).json({ message: 'Contract accepted successfully' });
  }
}

export default ContractsController;
