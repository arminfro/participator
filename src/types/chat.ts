import Link from './link';
import Room from './room';
import { User } from './user';

export interface ChatCreate {
  parentId?: number;
  userId: number;
  msg: string;
}

export interface ChatUpdate {
  id: number;
  msg: string;
}

export default interface Chat {
  readonly id: number;
  msg: string;
  readonly room: Room;
  readonly user: User;
  readonly links: Link[];
  readonly children?: Chat[];
  readonly parent?: Chat;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export enum Events {
  create = 'createChat',
  findAll = 'findAllChats',
  update = 'updateChat',
  remove = 'removeChat',
}
