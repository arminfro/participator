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
import ChatModel from '../../types/chat';
import { Link } from '../links/link.entity';
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

  @OneToMany(() => Link, (link) => link.chat)
  links: Link[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
