import React, { createContext, ReactElement, useContext } from 'react';
import { UseStruct } from '../hooks/use-struct';

interface StructProviderProps<T> {
  struct: UseStruct<T>;
  children: ReactElement;
}

interface StructContext<T> {
  struct: UseStruct<T>;
}

const StructContext = createContext({} as StructContext<any>);

export function useStructContext<T>(): StructContext<T> {
  return useContext<StructContext<T>>(StructContext);
}

export function StructProvider<T>({
  struct,
  children,
}: StructProviderProps<T>): ReactElement {
  return (
    <StructContext.Provider value={{ struct }}>
      {children}
    </StructContext.Provider>
  );
}
