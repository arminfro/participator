import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User as UserModel } from '../../types/user';
import { Answer } from '../answers/answer.entity';
import { Chat } from '../chats/chat.entity';
import { Question } from '../questions/question.entity';
import { Room } from '../rooms/room.entity';
import PasswordRecover from '../login/password-recover.entity';
import { avatarRoot } from '../../constants';

@Entity()
export class User extends BaseEntity implements UserModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  name!: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Column()
  password!: string;

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

  @Column()
  @Generated('uuid')
  uuid!: string;

  @Column({ nullable: true })
  @IsOptional()
  avatarUrl: string | null;

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

  @OneToMany(() => PasswordRecover, (passwordRecover) => passwordRecover.user)
  passwordRecovers: PasswordRecover[];

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

  avatarStaticPath(): string {
    return `${avatarRoot}/${this.uuid}`;
  }
}
