import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from '../../casl/action';
import { User } from '../users/user.entity';

type Subjects = typeof User | User | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    // // if isAdmin
    // if (user.id === 30) {
    //   // can(Action.Manage, 'all'); // read-write access to everything
    // } else {
    // }

    can(Action.Read, 'all'); // read-only access to everything
    can(Action.Manage, User, { id: user.id });
    // cannot(Action.Delete, Article, { isPublished: true });

    return build();
  }
}
