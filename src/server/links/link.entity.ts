import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import LinkModel from '../../types/link';
import { Chat } from '../chats/chat.entity';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';

@Entity()
export class Link extends BaseEntity implements LinkModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  domain!: string;

  @Column()
  imgUrl!: string;

  @ManyToOne(() => Chat, (chat) => chat.links)
  chat: Chat;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}