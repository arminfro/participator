import React, { createContext, ReactElement, useContext } from 'react';
import { Mutate } from '../container/fetch';

interface SwrMutateProviderProps<T> {
  mutateProps: SwrMutateContext<T>;
  children: ReactElement | ReactElement[];
}

type SwrMutateContext<T> = Record<string, Mutate<T>>;

const SwrMutateContext = createContext({} as SwrMutateContext<any>);

export function useSwrMutateContext<T>(): SwrMutateContext<T> {
  return useContext<SwrMutateContext<T>>(SwrMutateContext);
}

export function SwrMutateProvider<T>({
  mutateProps,
  children,
}: SwrMutateProviderProps<T>): ReactElement {
  return (
    <SwrMutateContext.Provider value={mutateProps}>
      {children}
    </SwrMutateContext.Provider>
  );
}
