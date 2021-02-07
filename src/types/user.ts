import Room from './room';

export interface UserCreate {
  name: string;
  pw1: string;
  pw2: string;
}

export interface UserUpdate extends Partial<UserCreate> {
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
  hasHandUp: boolean;
  randomGroup: boolean;
  active: boolean;
  readonly joinedRooms: Room[];
  readonly ownedRooms: Room[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

// export interface UserModel extends User {
//   password: string;
// }

export type UserEditBooleanAttrs = 'hasHandUp' | 'randomGroup' | 'active';
export type UserEditAttrs = UserEditBooleanAttrs & 'name';
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

export function validateUserUpdate(userUpdate: UserUpdate): ValidationErrors {
  const errors: string[] = validateUserCreate({
    name: userUpdate.name,
    pw1: userUpdate.pw1,
    pw2: userUpdate.pw2,
  });
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
