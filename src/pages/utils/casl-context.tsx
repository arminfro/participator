import React, { createContext, ReactElement, useContext } from 'react';
import { createContextualCan } from '@casl/react';
import { Ability } from '@casl/ability';
import { useStore } from './store/context';
import { ability } from '../../casl/ability';
import { User } from '../../types/user';

export const AbilityContext = createContext<Ability>({} as Ability);

export const Can = createContextualCan(AbilityContext.Consumer);

export const useAbility = (): Ability => useContext<Ability>(AbilityContext);

export function AbilityContextProvider(props: {
  children: ReactElement | ReactElement[];
}): ReactElement {
  const {
    store: { user },
  } = useStore();

  return (
    <AbilityContext.Provider value={ability(user as User)}>
      {props.children}
    </AbilityContext.Provider>
  );
}
