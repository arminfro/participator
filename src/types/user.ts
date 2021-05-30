import {
  any,
  array,
  boolean,
  Describe,
  Infer,
  is,
  number,
  object,
  optional,
  refine,
  string,
  validate,
} from 'superstruct';
import { Answer } from './answer';
import { Chat } from './chat';
import { Question } from './question';
import { Room } from './room';
import { isEmail, stringMinLength } from './utils';

export type UserCreate = {
  name: string;
  email: string;
  pw1: string;
  pw2: string;
  passwordResetId?: string;
};
export const UserCreate = refine(
  object({
    name: stringMinLength(2, 'name'),
    email: isEmail('email'),
    pw1: stringMinLength(1, 'pw1'),
    pw2: stringMinLength(1, 'pw2'),
    passwordResetId: optional(string()),
  }),
  'equalPws',
  (userCreate) => userCreate.pw1 === userCreate.pw2,
);

export type UserUpdateToggle = Partial<Infer<typeof UserUpdateToggle>>;
export type UserUpdateToggleKeys = keyof UserUpdateToggle;
export const UserUpdateToggle = object({
  hasHandUp: optional(boolean()),
  randomGroup: optional(boolean()),
  active: optional(boolean()),
});

export type UserUpdate = Partial<Infer<typeof UserUpdate>>;
export const UserUpdate = object({
  name: stringMinLength(2, 'name'),
  hasHandUp: optional(boolean()),
  randomGroup: optional(boolean()),
  active: optional(boolean()),
});

export type UserLogin = Infer<typeof UserLogin>;
export const UserLogin = object({
  email: isEmail('email'),
  password: stringMinLength(2, 'password'),
});

export type UserPasswordRecover = Infer<typeof UserPasswordRecover>;
export const UserPasswordRecover = object({
  email: isEmail('email'),
});

export type User = {
  readonly id: number;
  name: string;
  email: string;
  password?: string | null;
  readonly joinedRooms?: Room[];
  readonly ownedRooms?: Room[];
  readonly chats?: Chat[];
  readonly questions?: Question[];
  readonly answers?: Answer[];
  hasHandUp: boolean;
  randomGroup: boolean;
  active: boolean;
  readonly uuid?: string;
  readonly createdAt?: Date | string;
  readonly updatedAt?: Date | string;
};
export const User: Describe<User> = object({
  id: number(),
  name: string(),
  email: string(),
  password: optional(string()),
  joinedRooms: optional(array(any())),
  ownedRooms: optional(array(any())),
  chats: optional(array(any())),
  questions: optional(array(any())),
  answers: optional(array(any())),
  hasHandUp: boolean(),
  randomGroup: boolean(),
  active: boolean(),
  uuid: optional(string()),
  createdAt: optional(any()),
  updatedAt: optional(any()),
});

export function isUser(user: User): user is User {
  if (is(user, User)) {
    return true;
  } else {
    console.debug("isn't a User:", validate(user, User));
    return false;
  }
}
