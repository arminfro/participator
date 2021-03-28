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
import {
  FixAnswer as IFixAnswer,
  Question as IQuestion,
} from '../../types/question';
import { FixAnswer } from '../questions/fix-answer.entity';
import { Question } from '../questions/question.entity';
import { User } from '../users/user.entity';

@Entity()
export class Answer extends BaseEntity implements AnswerModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  freeAnswer?: string;

  @ManyToOne(() => FixAnswer, (fixAnswer) => fixAnswer.answers)
  fixAnswer?: IFixAnswer;

  @ManyToOne(() => Question, (question) => question.answers)
  question: IQuestion;

  @ManyToOne(() => User, (user) => user.answers)
  user: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
