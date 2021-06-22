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

  @Column({ nullable: true })
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  domain!: string;

  @Column({ nullable: true })
  imgUrl!: string;

  @Column({ nullable: true })
  url!: string;

  @ManyToOne(() => Chat, (chat) => chat.links)
  chat: Chat;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
