import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import ChatModel from '../../types/chat';
import { Link } from '../links/link.entity';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';

@Entity()
@Tree('materialized-path')
export class Chat extends BaseEntity implements ChatModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  msg!: string;

  @OneToOne(() => Room, (room) => room.chat)
  room: Room;

  @ManyToOne(() => User, (user) => user.chats)
  user: User;

  @OneToMany(() => Link, (link) => link.chat)
  links: Link[];

  @TreeChildren()
  children: Chat[];

  @TreeParent()
  parent: Chat;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
