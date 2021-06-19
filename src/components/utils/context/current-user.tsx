import React, {
  createContext,
  Dispatch,
  ReactElement,
  useContext,
  useReducer,
} from 'react';
import { User } from '../../../types/user';

export function initializeStore(): User {
  return undefined;
}

interface CurrentUserContext {
  user: User;
  dispatch: Dispatch<Actions>;
}

export const CurrentUserContext = createContext({} as CurrentUserContext);

export const useCurrentUser = (): CurrentUserContext =>
  useContext(CurrentUserContext);

export interface Login {
  type: 'LOGIN';
  user: User;
}

export interface Logout {
  type: 'LOGOUT';
}

export type Actions = Login | Logout;

function reducer(_user: User, action: Actions): User {
  switch (action.type) {
    case 'LOGIN':
      return action.user;
    case 'LOGOUT': {
      return undefined;
    }
  }
}

export default function CurrentUserProvider(props: {
  children: ReactElement | ReactElement[];
  user?: User;
}): ReactElement {
  const [user, dispatch] = useReducer(reducer, props.user || initializeStore());

  return (
    <CurrentUserContext.Provider value={{ user, dispatch }}>
      {props.children}
    </CurrentUserContext.Provider>
  );
}
