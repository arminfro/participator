import Room from './room';
import User from './user';

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
  readonly msg: string;
  readonly room: Room;
  readonly user: User;
  readonly parent?: Chat;
  readonly children?: Chat[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export enum Events {
  create = 'createChat',
  findAll = 'findAllChats',
  update = 'updateChat',
  remove = 'removeChat',
}
