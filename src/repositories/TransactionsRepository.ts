import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TypeBalance {
  type: 'income' | 'outcome';
}

interface typeCategory {
  category: string
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    let outcome = 0
    let income = 0
    let transactions = await this.find()
    transactions.reduce((total, objects) => objects.type === "income" ? income += objects.value : outcome += objects.value, 0)

    const balance = { income, outcome, total: income - outcome }

    return balance
  }
  public validationType(type: string): TypeBalance | true {

    if (type === "income" || type === "outcome") {
      return { type }
    }

    return true
  }

  public async validationValue({ value, type }: { value: number, type: string }): Promise<false | true> {
    let transactions = await this.find()
    const balance = transactions.reduce((total, objects) => objects.type === "income" ? total += objects.value : total -= objects.value, 0)

    if (type === "outcome" && balance < value) {
      return true
    }

    return false
  }

  public async validationCategory({ category }: typeCategory): Promise<{ id: string }> {
    const categoryReposittory = getRepository(Category)
    const checkCategoryExists = await categoryReposittory.find({ where: { title: category } })

    if (checkCategoryExists.length === 0) {
      let newCategory = categoryReposittory.create({ title: category })

      newCategory = await categoryReposittory.save(newCategory);

      return { id: newCategory.id }
    }

    return { id: checkCategoryExists[0].id }

  }
}

export default TransactionsRepository;
