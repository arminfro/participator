import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Answer } from '../answers/answer.entity';
import { Question as IQuestion, AnswersFormat } from '../../types/question';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { FixAnswer } from './fix-answer.entity';

@Entity()
export class Question extends BaseEntity implements IQuestion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  text!: string;

  @Column()
  answersFormat!: AnswersFormat;

  @OneToMany(() => FixAnswer, (fixAnswer) => fixAnswer.question)
  fixAnswers!: FixAnswer[];

  @ManyToOne(() => Room, (room) => room.questions)
  room: Room;

  @ManyToOne(() => User, (user) => user.questions)
  user: User;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
