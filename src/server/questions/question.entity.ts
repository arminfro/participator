import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import QuestionsModelType from '../../types/question';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';

interface QuestionsModel extends QuestionsModelType {
  answersFormat: string; //quick fix, sqlite doesnt support json column
}

@Entity()
export class Question extends BaseEntity implements QuestionsModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  text!: string;

  @Column()
  answersFormat!: string; // AnswersFormat, quick fix, sqlite doesnt support json column

  @ManyToOne(() => Room, (room) => room.questions)
  room: Room;

  @ManyToOne(() => User, (user) => user.questions)
  user: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
