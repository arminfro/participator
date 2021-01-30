import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import ChatModel from '../../types/chat';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';

@Entity()
export class Chat extends BaseEntity implements ChatModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Room, (room) => room.chats)
  room: Room;

  @Column()
  msg!: string;

  @ManyToOne(() => User, (user) => user.chats)
  user: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
