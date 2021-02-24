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
import IQuestion, {
  FixAnswer as IFixAnswer,
  AnswersFormat,
} from '../../types/question';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';

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

@Entity()
export class FixAnswer extends BaseEntity implements IFixAnswer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  answer: string;

  @ManyToOne(() => Question, (question) => question.fixAnswers)
  question: Question;
}
