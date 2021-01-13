import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserModel from '../../types/user';

@Entity()
export class User implements UserModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  hasHandUp!: boolean;

  @Column({ default: false })
  randomGroup!: boolean;

  @Column({ default: true })
  active!: boolean;

  @Column()
  groupId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
