import { faker } from '@faker-js/faker';
import { times } from 'lodash';
import { User, UserCreate } from '../../src/types/user';
import GenericSeeder from './generic-seeder';
import RoomSeeder from './room';
import { api } from './utils';

export default class UserSeeder extends GenericSeeder<User> {
  static password = 'hello-world';

  user: User | undefined;
  roomSeeders: RoomSeeder[];
  token: string;

  constructor() {
    super();
    this.login = this.login.bind(this);
    this.create = this.create.bind(this);
    // this.uploadAvatar = this.uploadAvatar.bind(this);
  }

  async create(email?: string) {
    this.user = await GenericSeeder.prototype.create.call(
      this,
      'api/users',
      '',
      {
        name: faker.name.firstName(),
        pw1: UserSeeder.password,
        pw2: UserSeeder.password,
        email: email || faker.internet.email().replace(/@.*$/, '@localhost.me'),
        // results in net::ERR_BLOCKED_BY_RESPONSE.NotSameOriginAfterDefaultedToSameOriginByCoep
        // avatarUrl: faker.internet.avatar(),
      } as UserCreate,
    );
    await this.login();
    this.roomSeeders = times(1).map(
      () => new RoomSeeder(this.token, this.user.id),
    );
  }

  // todo, not working, file gets received by server, but somehow content is not right, maybe encoding issue
  // async uploadAvatar() {
  //   const avatarUrl = faker.internet.avatar();
  //   axios
  //     .get(avatarUrl, {
  //       headers: { responseType: 'arraybuffer' },
  //     })
  //     .then((response) => {
  //       const file = Buffer.from(response.data);
  //       const form = new FormData();
  //       form.append('avatar', file, 'avatar.jpg');
  //       api(
  //         'post',
  //         `api/users/${this.user.id}/upload-avatar`,
  //         this.token,
  //         form,
  //         {
  //           ...form.getHeaders(),
  //         },
  //       );
  //     });
  // }

  async login() {
    const login = await api<{ user: User; access_token: string }>(
      'post',
      'login',
      '',
      {
        email: this.user.email,
        password: UserSeeder.password,
      },
    );
    if (login) {
      this.token = login.access_token;
    }
  }
}
