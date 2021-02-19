import Chat from './chat';
import Question from './question';
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
  name: string;
  description?: string;
  openToJoin: boolean;
  readonly members: User[];
  readonly admin: User;
  readonly chat?: Chat;
  readonly questions?: Question[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export enum JoinConditions {
  Open = 'open-to-join',
  Closed = 'invite-to-join',
}
