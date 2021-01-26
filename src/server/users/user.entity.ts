import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  BaseEntity,
} from 'typeorm';
import UserModel from '../../types/user';
import { Room } from '../rooms/room.entity';

@Entity()
export class User extends BaseEntity implements UserModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  password!: string;

  @OneToMany(() => Room, (room) => room.admin, {
    eager: true,
  })
  ownedRooms: Room[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany((type) => Room, (room) => room.members, {
    eager: true,
  })
  joinedRooms: Room[];

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

  // for casl
  static get modelName() {
    return 'User';
  }
}
