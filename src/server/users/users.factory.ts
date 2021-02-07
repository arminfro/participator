import * as Faker from 'faker';
import { define } from 'typeorm-factories';
import { AuthService } from '../auth/auth.service';
import { User } from './user.entity';

define(User, (faker: typeof Faker) => {
  const user = new User();
  user.id = faker.random.number();
  user.joinedRooms = [];
  user.password = AuthService.hashPassword('pw');
  user.ownedRooms = [];
  user.createdAt = faker.date.recent();
  user.updatedAt = user.createdAt;
  return user;
});
