import { faker } from '@faker-js/faker';
import { define } from 'typeorm-factories';
import { AuthService } from '../auth/auth.service';
import { User } from './user.entity';

define(User, (faker: any) => {
  const user = new User();
  user.id = faker.random.number();
  user.name = faker.random.word();
  user.email = faker.internet.email();
  user.joinedRooms = [];
  user.password = AuthService.hashPassword('pw');
  user.ownedRooms = [];
  user.createdAt = faker.date.recent();
  user.updatedAt = user.createdAt;
  return user;
});
