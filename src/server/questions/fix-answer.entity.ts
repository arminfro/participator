import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FixAnswer as IFixAnswer } from '../../types/question';
import { Question } from './question.entity';

@Entity()
export class FixAnswer extends BaseEntity implements IFixAnswer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  answer: string;

  @ManyToOne(() => Question, (question) => question.fixAnswers)
  question: Question;
}
