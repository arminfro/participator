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

@Entity()
export class Link extends BaseEntity implements LinkModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  domain!: string;

  @Column({ nullable: true })
  imgUrl!: string;

  @Column()
  url!: string;

  @ManyToOne(() => Chat, (chat) => chat.links)
  chat: Chat;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
