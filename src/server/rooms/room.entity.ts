import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { User } from '../users/user.entity';
import RoomModel from '../../types/room';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany((type) => User, (user) => user.joinedRooms, {
    cascade: true,
  })
  @JoinTable()
  members: User[];

  @ManyToOne(() => User, (user) => user.ownedRooms)
  admin: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  static get modelName() {
    return 'Room';
  }
}
