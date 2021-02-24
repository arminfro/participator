import { subject } from '@casl/ability';
import { Room } from '../types/room';
import { User } from '../types/user';
import { ability } from './ability';
import { Action } from './action';

describe('Abilities define Authorization', () => {
  it('room admin should be able to manage', () => {
    const adminUser: Partial<User> = {
      id: 1,
      name: 'Max',
    };

    const nonAdminUser: Partial<User> = {
      id: 0,
      name: 'Max',
    };

    const room: Partial<Room> = {
      id: 1,
      admin: <User>adminUser,
    };

    expect(
      ability(adminUser as User).can(
        Action.Manage,
        subject('Room', room as Room),
      ),
    ).toBeTruthy();

    expect(
      ability(nonAdminUser as User).can(
        Action.Manage,
        subject('Room', room as Room),
      ),
    ).toBeFalsy();
  });

  it('user can only manage themselves', () => {
    const user1: Partial<User> = {
      id: 1,
      name: 'Max',
    };

    const user2: Partial<User> = {
      id: 0,
      name: 'Max',
    };

    expect(
      ability(user1 as User).can(Action.Manage, subject('User', user1 as User)),
    ).toBeTruthy();

    expect(
      ability(user1 as User).can(Action.Manage, subject('User', user2 as User)),
    ).toBeFalsy();
  });
});
