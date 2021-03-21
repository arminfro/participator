import React, {
  createContext,
  ReactElement,
  SetStateAction,
  useContext,
} from 'react';
import useLocalStorage from './hooks/use-local-storage';
import { getToken } from './token';

interface LocalStorageProviderProps<T> {
  url: string;
  children: (data: T) => ReactElement;
}

interface LocalStorageContext<T> {
  keys: string[];
  setLocalStorage: SetStateAction<T>;
}

const LocalStorageContext = createContext({} as LocalStorageContext<any>);

export function useLocalStorageContext<T>(): LocalStorageContext<T> {
  return useContext<LocalStorageContext<T>>(LocalStorageContext);
}

export function LocalStorageProvider<T>({
  url,
  children,
}: LocalStorageProviderProps<T>): ReactElement {
  const keys = [url, getToken()];
  const [localStorage, setLocalStorage] = useLocalStorage<T>(keys.join());
  return (
    <LocalStorageContext.Provider value={{ keys, setLocalStorage }}>
      {children(localStorage)}
    </LocalStorageContext.Provider>
  );
}
