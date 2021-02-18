import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import AnswerModel from '../../types/answer';
import { Question } from '../questions/question.entity';
import { User } from '../users/user.entity';

@Entity()
export class Answer extends BaseEntity implements AnswerModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  textAnswer?: string;

  @Column({ nullable: true })
  fixAnswer?: string;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;

  @ManyToOne(() => User, (user) => user.answers)
  user: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
