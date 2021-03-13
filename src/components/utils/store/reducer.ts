import { Actions } from './actions';
import Store from './store';

export default function reducer(store: Store, action: Actions): Store {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...store,
        user: action.user,
      };
    case 'LOGOUT': {
      return {
        ...store,
        user: undefined,
      };
    }
  }
}
