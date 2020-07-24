
import { getCustomRepository, getRepository, In } from "typeorm"

import path from "path";
import fs from "fs";
import csvParse from 'csv-parse';

import Transaction from '../models/Transaction';
import Category from "../models/Category";

import uploadConfig from "../config/upload";
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  csvFileName: string;
}
interface CSVTransaction {
  title: string;
  type: "income" | "outcome";
  value: number;
  category: string;
}
class ImportTransactionsService {
  async execute({ csvFileName }: Request): Promise<Transaction[]> {

    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const categoriesRepository = getRepository(Category)

    const csvPath = path.join(uploadConfig.directory, csvFileName)
    const userAvatarFileExists = await fs.promises.stat(csvPath)
    const readCSV = fs.createReadStream(csvPath)

    const config = csvParse({
      from_line: 2,
    })

    const tableCSV = readCSV.pipe(config)
    let categories: string[] = []
    let transactions: CSVTransaction[] = []

    await tableCSV.on("data", async line => {
      const [title, type, value, category] = line.map((cell: string) => cell.trim())

      if (!title || !type || !value) return;

      transactions.push({ title, type, value, category })

      categories.push(category)
    })

    await new Promise(resolve => tableCSV.on("end", resolve))

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    })
    const existentCategoriesTitles = existentCategories.map((category: Category) => category.title)

    const addCategoryTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategory = categoriesRepository.create(addCategoryTitles.map(title => ({
      title,
    }))
    )

    await categoriesRepository.save(newCategory)

    const finishCategories = [...newCategory, ...existentCategories]

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finishCategories.find(category => category.title === transaction.category)
      }))
    )
    const save = await transactionsRepository.save(createdTransactions)

    return save;
  }
}


export default ImportTransactionsService;
