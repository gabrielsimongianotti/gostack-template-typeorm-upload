import AppError from '../errors/AppError';
import { getCustomRepository } from "typeorm"
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute({ id }: { id: string }): Promise<void> {
    
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id)

    if (!transaction) throw new AppError("id invalidy", 401)

    await transactionsRepository.remove(transaction)

  }
}

export default DeleteTransactionService;
