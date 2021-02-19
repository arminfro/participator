import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import RoomModel from '../../types/room';
import { Chat } from '../chats/chat.entity';
import { Question } from '../questions/question.entity';
import { User } from '../users/user.entity';

@Entity()
export class Room extends BaseEntity implements RoomModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ default: '' })
  description?: string;

  @Column({ default: false })
  openToJoin!: boolean;

  @ManyToMany(() => User, (user) => user.joinedRooms)
  @JoinTable()
  members: User[];

  @ManyToOne(() => User, (user) => user.ownedRooms)
  admin: User;

  @OneToOne(() => Chat, (chat) => chat.room)
  @JoinColumn()
  chat?: Chat;

  @OneToMany(() => Question, (question) => question.room)
  questions: Question[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  static get modelName() {
    return 'Room';
  }
}
