import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserModel from '../../types/user';
import { Answer } from '../answers/answer.entity';
import { Chat } from '../chats/chat.entity';
import { Question } from '../questions/question.entity';
import { Room } from '../rooms/room.entity';

@Entity()
export class User extends BaseEntity implements UserModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  @IsNotEmpty()
  name!: string;

  @Column()
  password!: string;

  @OneToMany(() => Room, (room) => room.admin)
  ownedRooms: Room[];

  @ManyToMany(() => Room, (room) => room.members)
  joinedRooms: Room[];

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @Column({ default: false })
  @IsBoolean()
  @IsOptional()
  hasHandUp!: boolean;

  @Column({ default: false })
  @IsBoolean()
  @IsOptional()
  randomGroup!: boolean;

  @Column({ default: true })
  @IsBoolean()
  @IsOptional()
  active!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // for casl
  static get modelName() {
    return 'User';
  }

  isPartOfRoom(roomId: number): boolean {
    return !![...this.joinedRooms, ...this.ownedRooms].find(
      (room) => room.id === roomId,
    );
  }
}
