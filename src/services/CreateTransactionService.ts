import { getCustomRepository } from "typeorm"
import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
// import Category from "../models/Category";

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    // const categoryReposittory = getRepository(Category)

    const { id } = await transactionsRepository.validationCategory({ category });

    // const newCategory= categoryReposittory.create({ title: category })
    // if (validationCategory === true)

    const validationType = await transactionsRepository.validationType(type);

    if (validationType === true) throw new AppError("invalidy type", 401)

    const validationValue = await transactionsRepository.validationValue({ value, type });

    if (validationValue === true) throw new AppError("value invalidy ", 400)

    const transaction = transactionsRepository.create({
      title,
      value,
      type: validationType.type,
      category_id: id
    })

    await transactionsRepository.save(transaction)

    return transaction
  }
}

export default CreateTransactionService;
