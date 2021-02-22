import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Room } from '../types/room';
import { User, isUser } from '../types/user';
import { Action } from './action';

type Subjects = User | 'User' | Room | 'Room' | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

export function ability(user: User | undefined) {
  const { can, cannot, build } = new AbilityBuilder<
    Ability<[Action, Subjects]>
  >(Ability as AbilityClass<AppAbility>);

  cannot(Action.Manage, 'all');

  if (!user) return build();

  if (isUser(user)) {
    can(Action.Manage, 'Room', {
      'admin.id': user.id,
    });
    can(Action.Manage, 'User', { id: user.id });
  }

  return build();
}
