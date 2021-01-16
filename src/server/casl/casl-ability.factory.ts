import { Injectable } from '@nestjs/common';
import { ability } from '../../casl/ability';
import { User } from '../users/user.entity';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    return ability(user);
  }
}
