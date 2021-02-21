import { equals } from 'class-validator';
import {
  any,
  array,
  boolean,
  date,
  Describe,
  Infer,
  is,
  number,
  object,
  optional,
  refine,
  string,
} from 'superstruct';
import Answer from './answer';
import { Chat } from './chat';
import Question from './question';
import { Room } from './room';
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

export type User = {
  readonly id: number;
  name: string;
  readonly joinedRooms?: Room[];
  readonly ownedRooms?: Room[];
  readonly chats?: Chat[];
  readonly questions?: Question[];
  readonly answers?: Answer[];
  hasHandUp: boolean;
  randomGroup: boolean;
  active: boolean;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
};
export const User: Describe<User> = object({
  id: number(),
  name: stringMinLength(2, 'name'),
  joinedRooms: optional(array(any())),
  ownedRooms: optional(array(any())),
  chats: optional(array(any())),
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
