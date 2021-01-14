import User from '../../../types/user';

export interface Login {
  type: 'LOGIN';
  user: User;
}

export interface Logout {
  type: 'LOGOUT';
}

export type Actions = Login | Logout;
