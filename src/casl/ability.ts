import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import User from '../types/user';
import { Action } from './action';

type Subjects = User | 'User' | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

export function ability(user: User) {
  const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
    Ability as AbilityClass<AppAbility>,
  );

  can(Action.Read, 'all'); // read-only access to everything
  can(Action.Manage, 'User', { id: user.id });

  return build();
}
