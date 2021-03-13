import { createContext, Dispatch, useContext } from 'react';
import { Actions } from './actions';
import Store from './store';

interface StoreContext {
  store: Store;
  dispatch: Dispatch<Actions>;
}

export const StoreContext = createContext({} as StoreContext);

export const useStore = (): StoreContext => useContext(StoreContext);
