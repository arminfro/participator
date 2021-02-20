import { equals } from 'class-validator';
import { boolean, Infer, object, optional, refine, string } from 'superstruct';
import Answer from './answer';
import Chat from './chat';
import Question from './question';
import Room from './room';
import { stringLengthGtTwo } from './utils.validation';

export type UserCreate = Infer<typeof UserCreate>;
export const UserCreate = object({
  name: stringLengthGtTwo('name'),
  pws: refine(object({ pw1: string(), pw2: string() }), 'pws', (value) =>
    equals(value.pw1, value.pw2),
  ),
});

export type UserUpdateToggle = Partial<Infer<typeof UserUpdateToggle>>;
export const UserUpdateToggle = object({
  hasHandUp: optional(boolean()),
  randomGroup: optional(boolean()),
  active: optional(boolean()),
});

export type UserUpdate = Partial<Infer<typeof UserUpdate> & UserUpdateToggle>;
export const UserUpdate = object({
  name: stringLengthGtTwo('name'),
});

export type UserLogin = Infer<typeof UserLogin>;
export const UserLogin = object({
  name: stringLengthGtTwo('username'),
  password: string(),
});

export default interface User {
  readonly id: number;
  name: string;
  readonly joinedRooms: Room[];
  readonly ownedRooms: Room[];
  readonly chats?: Chat[];
  readonly questions?: Question[];
  readonly answers?: Answer[];
  hasHandUp: boolean;
  randomGroup: boolean;
  active: boolean;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export type UserUpdateToggleKeys = keyof UserUpdateToggle;

// todo, implement User as Struct and return is()
export function isUser(data: User): data is User {
  return (
    data instanceof Object &&
    (['id', 'name'] as Array<keyof User>).every(
      (attribute) => (data as User)[attribute],
    )
  );
}
