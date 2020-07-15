import { uuid } from 'uuidv4';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from "typeorm";

import Category from "./Category"
@Entity("transactions")
class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column("float8")
  value: number;


  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id" })
  category_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
