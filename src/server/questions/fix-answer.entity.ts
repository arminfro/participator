import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FixAnswer as IFixAnswer } from '../../types/question';
import { Answer } from '../answers/answer.entity';
import { Question } from './question.entity';

@Entity()
export class FixAnswer extends BaseEntity implements IFixAnswer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  text: string;

  @ManyToOne(() => Question, (question) => question.fixAnswers)
  question: Question;

  @OneToMany(() => Answer, (answer) => answer.fixAnswer)
  answers: Answer[];
}
