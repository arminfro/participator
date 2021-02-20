import { createContext, ReactElement, useContext } from 'react';
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

  console.debug('render AbilityContextProvider');

  return (
    <AbilityContext.Provider value={ability((user || { id: 0 }) as User)}>
      {props.children}
    </AbilityContext.Provider>
  );
}
