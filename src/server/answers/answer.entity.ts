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
import { QuestionDBModel } from '../../types/question';
import { Question } from '../questions/question.entity';
import { User } from '../users/user.entity';

@Entity()
export class Answer extends BaseEntity implements AnswerModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  freeAnswer?: string;

  @Column({ nullable: true })
  rangeAnswer?: number;

  @Column({ nullable: true })
  fixAnswer?: string;

  @ManyToOne(() => Question, (question) => question.answers)
  question: QuestionDBModel;

  @ManyToOne(() => User, (user) => user.answers)
  user: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
