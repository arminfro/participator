import { useState } from 'react';

export default function useLocalStorage<T>(
  key: string,
): [T, (newState: T) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  });

  const setLocalStorageState = (newState: T) => {
    try {
      setState(newState);
      window.localStorage.setItem(key, JSON.stringify(newState));
    } catch (error) {
      console.error(`Unable to store ${key} in localStorage.`);
    }
  };

  return [state, setLocalStorageState];
}
