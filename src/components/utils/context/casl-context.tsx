import React, { createContext, ReactElement, useContext } from 'react';
import { createContextualCan } from '@casl/react';
import { Ability } from '@casl/ability';
import { ability } from '../../../casl/ability';
import { User } from '../../../types/user';
import { useCurrentUser } from './current-user';

export const AbilityContext = createContext<Ability>({} as Ability);

export const Can = createContextualCan(AbilityContext.Consumer);

export const useAbility = (): Ability => useContext<Ability>(AbilityContext);

export function AbilityContextProvider(props: {
  children: ReactElement | ReactElement[];
}): ReactElement {
  const { user } = useCurrentUser();

  return (
    <AbilityContext.Provider value={ability(user as User)}>
      {props.children}
    </AbilityContext.Provider>
  );
}
