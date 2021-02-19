import Answer from './answer';
import Chat from './chat';
import Question from './question';
import Room from './room';

export interface UserCreate {
  name: string;
  pw1: string;
  pw2: string;
}

export interface UserUpdate extends UserUpdateToggle {
  name?: string;
}

export interface UserUpdateToggle {
  hasHandUp?: boolean;
  randomGroup?: boolean;
  active?: boolean;
}

export interface UserLogin {
  username: string;
  password: string;
}

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

export type UserUpdateAttrs = keyof UserUpdate;
export type UserUpdateToggleAttrs = keyof UserUpdateToggle;
export const userEditBooleanAttrs: UserUpdateToggleAttrs[] = [
  'hasHandUp',
  'randomGroup',
  'active',
];

export type ValidationErrors = string[];

export function validateUserCreate(user: UserCreate): ValidationErrors {
  const errors: string[] = [];
  if (user.pw1 !== user.pw2) {
    errors.push('Passwords not identical');
  }
  if (user.name === '') {
    errors.push('Username empty');
  }
  return errors;
}

export function validateUserUpdate(userUpdate: UserUpdate): ValidationErrors {
  // todo
  return [];
}

export function isUser(data: User): data is User {
  return (
    data instanceof Object &&
    (['id', 'name'] as Array<keyof User>).every(
      (attribute) => (data as User)[attribute],
    )
  );
}
