import Room from './room';

export interface UserCreate {
  name: string;
  pw1: string;
  pw2: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export default interface User {
  readonly id: number;
  name: string;
  hasHandUp: boolean;
  randomGroup: boolean;
  active: boolean;
  readonly groupId?: number;
  readonly joinedRooms: Room[];
  readonly ownedRooms: Room[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

// export interface UserModel extends User {
//   password: string;
// }

export type UserEditBooleanAttrs = 'hasHandUp' | 'randomGroup' | 'active';
export type UserEditAttrs = (UserEditBooleanAttrs & 'name') | 'groupId';
export const userEditBooleanAttrs: UserEditBooleanAttrs[] = [
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

export function validateUserEdit(
  oldUser: User,
  newUser: User,
): ValidationErrors {
  const errors: string[] = [];
  if (newUser.name === '') {
    errors.push('Username empty');
  }
  if (oldUser.groupId !== newUser.groupId && newUser.groupId) {
    errors.push('Pick new Room at Rooms api ressource');
  }
  return errors;
}

export function isUser(data: User): data is User {
  return (
    data instanceof Object &&
    (['id', 'name'] as Array<keyof User>).every(
      (attribute) => (data as User)[attribute],
    )
  );
}
