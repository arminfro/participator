import {
  any,
  boolean,
  define,
  Infer,
  is,
  object,
  optional,
  string,
} from 'superstruct';
import Chat from './chat';
import Question from './question';
import User from './user';
import { stringMinLength } from './utils.validation';

const RoomCreateStruct = define('RoomCreate', (value) => is(value, RoomCreate));
export type RoomCreate = Infer<typeof RoomCreate>;
export const RoomCreate = object({
  name: stringMinLength(3, 'name'),
  description: optional(string()),
  openToJoin: boolean(),
  admin: any(),
});

export type RoomUpdate = Partial<Infer<typeof RoomUpdate>>;
export const RoomUpdate = object({
  addMember: optional(any()),
  removeMember: optional(any()),
  updateAttrs: optional(RoomCreateStruct),
});

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
