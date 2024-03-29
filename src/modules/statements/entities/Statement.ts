import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { v4 as uuid } from 'uuid'

import { User } from '../../users/entities/User'

export enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFERS = 'transfers'
}

@Entity('statements')
export class Statement {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @ManyToOne(() => User, (user) => user.statement)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'sender_id', type: 'uuid' })
  senderId?: string

  @ManyToOne(() => User, (user) => user.statement)
  @JoinColumn({ name: 'sender_id' })
  sender?: User

  @Column()
  description: string

  @Column('decimal', { precision: 5, scale: 2 })
  amount: number

  @Column({ type: 'enum', enum: OperationType })
  type: OperationType

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  constructor() {
    if (!this.id) {
      this.id = uuid()
    }
  }
}
