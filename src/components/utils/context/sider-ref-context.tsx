import React, { createContext, ReactElement, useContext } from 'react';

interface SiderRefProviderProps {
  siderRef: React.MutableRefObject<HTMLDivElement>;
  children: ReactElement;
}

interface SiderRefContext {
  ref: React.MutableRefObject<HTMLDivElement>;
}

const SiderRefContext = createContext({} as SiderRefContext);

export function useSiderRefContext(): SiderRefContext {
  return useContext<SiderRefContext>(SiderRefContext);
}

export function SiderRefProvider({
  siderRef,
  children,
}: SiderRefProviderProps): ReactElement {
  return (
    <SiderRefContext.Provider value={{ ref: siderRef }}>
      {children}
    </SiderRefContext.Provider>
  );
}
