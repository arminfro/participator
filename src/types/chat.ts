import Room from './room';
import User from './user';

export interface ChatCreate {
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
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export enum Events {
  createChat = 'createChat',
  findAllChats = 'findAllChats',
  updateChat = 'updateChat',
  removeChat = 'removeChat',
}
