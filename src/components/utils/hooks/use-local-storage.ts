import { SetStateAction, useState } from 'react';

type SetterFunc = <T>(prevState: T) => T;
type Setter<T> = SetStateAction<T>;
export type LocalStorageSetter<T> = Setter<T>;

export default function useLocalStorage<T>(
  key: string,
): [T, (setter: SetterFunc) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  });

  function setLocalStorageState(setter: T): void {
    try {
      let newStateValue: T;
      if (typeof setter === 'function') {
        newStateValue = (<unknown>(<SetterFunc>setter(state))) as T;
      } else {
        newStateValue = setter;
      }
      setState(newStateValue);
      window.localStorage.setItem(key, JSON.stringify(newStateValue));
    } catch (error) {
      console.error(`Unable to store ${key} in localStorage.`);
    }
  }

  return [state, setLocalStorageState as SetterFunc];
}
