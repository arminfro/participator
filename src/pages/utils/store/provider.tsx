import { ReactElement, useReducer } from 'react';
import reducer from './reducer';
import Store, { initializeStore } from './store';
import { StoreContext } from './context';

export default function StoreProvider(props: {
  children: ReactElement | ReactElement[];
  store?: Store;
}): ReactElement {
  const [store, dispatch] = useReducer(
    reducer,
    props.store || initializeStore(),
  );

  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {props.children}
    </StoreContext.Provider>
  );
}
