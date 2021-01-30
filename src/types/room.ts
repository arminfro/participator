import Chat from './chat';
import User from './user';

export interface RoomCreate {
  name: string;
  description: string;
  openToJoin: boolean;
  admin: User;
}

export interface RoomUpdate {
  addMember?: User;
  removeMember?: User;
  updateAttrs?: Room;
}

export default interface Room {
  readonly id: number;
  readonly name: string;
  readonly description?: string;
  readonly openToJoin: boolean;
  readonly chats: Chat[];
  readonly members: User[];
  readonly admin: User;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export enum JoinConditions {
  Open = 'open-to-join',
  Closed = 'invite-to-join',
}
