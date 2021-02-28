import { IsOptional } from 'class-validator';
import { add } from 'date-fns';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export default class PasswordRecover extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: false })
  @IsOptional()
  isUsed!: boolean;

  @ManyToOne(() => User, (user) => user.passwordRecovers)
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  isValid(): boolean {
    const validTimeframe = add(this.createdAt, {
      hours: 1,
    });

    return !this.isUsed && Number(validTimeframe) > Number(new Date());
  }
}
