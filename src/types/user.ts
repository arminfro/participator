import { equals } from 'class-validator';
import {
  any,
  array,
  boolean,
  date,
  Infer,
  is,
  number,
  object,
  optional,
  refine,
  string,
} from 'superstruct';
import { ChatStruct } from './structs/chat.struct';
import { RoomStruct } from './structs/room.struct';
import { stringMinLength } from './utils';

export type UserCreate = Infer<typeof UserCreate>;
export const UserCreate = object({
  name: stringMinLength(2, 'name'),
  pws: refine(object({ pw1: string(), pw2: string() }), 'pws', (value) =>
    equals(value.pw1, value.pw2),
  ),
});

export type UserUpdateToggle = Partial<Infer<typeof UserUpdateToggle>>;
export type UserUpdateToggleKeys = keyof UserUpdateToggle;
export const UserUpdateToggle = object({
  hasHandUp: optional(boolean()),
  randomGroup: optional(boolean()),
  active: optional(boolean()),
});

export type UserUpdate = Partial<Infer<typeof UserUpdate> & UserUpdateToggle>;
export const UserUpdate = object({
  name: stringMinLength(2, 'name'),
});

export type UserLogin = Infer<typeof UserLogin>;
export const UserLogin = object({
  username: stringMinLength(2, 'username'),
  password: string(),
});

export type User = Infer<typeof User>;
export const User = object({
  id: number(),
  name: stringMinLength(2, 'name'),
  joinedRooms: optional(array(RoomStruct)),
  ownedRooms: optional(array(RoomStruct)),
  chats: optional(array(ChatStruct)),
  questions: optional(array(any())),
  answers: optional(array(any())),
  hasHandUp: boolean(),
  randomGroup: boolean(),
  active: boolean(),
  createdAt: optional(date()),
  updatedAt: optional(date()),
});

export function isUser(user: User): user is User {
  return is(user, User);
}
