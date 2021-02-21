import {
  any,
  array,
  boolean,
  date,
  define,
  Infer,
  is,
  lazy,
  number,
  object,
  optional,
  string,
} from 'superstruct';
import { ChatStruct } from './structs/chat.struct';
import { UserStruct } from './structs/user.struct';
import { stringMinLength } from './utils';

export const RoomCreateStruct = define('RoomCreate', (value) =>
  is(value, RoomCreate));
export type RoomCreate = Infer<typeof RoomCreate>;
export const RoomCreate = object({
  name: stringMinLength(3, 'name'),
  description: optional(string()),
  openToJoin: boolean(),
  admin: UserStruct,
});

export type RoomUpdate = Partial<Infer<typeof RoomUpdate>>;
export const RoomUpdate = object({
  addMember: optional(UserStruct),
  removeMember: optional(UserStruct),
  updateAttrs: optional(RoomCreateStruct),
});

export type Room = Infer<typeof Room>;
export const Room = object({
  id: number(),
  name: string(),
  description: optional(string()),
  openToJoin: boolean(),
  members: optional(array(UserStruct)),
  admin: optional(UserStruct),
  // todo, without lazy -> ReferenceError: Cannot access 'Chat' before initialization
  chat: lazy(() => optional(ChatStruct)),
  questions: optional(array(any())),
  createdAt: optional(date()),
  updatedAt: optional(date()),
});

export enum JoinConditions {
  Open = 'open-to-join',
  Closed = 'invite-to-join',
}
