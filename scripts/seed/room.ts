import { Room, RoomCreate } from '../../src/types/room';
import * as Faker from 'faker';
import GenericSeeder from './generic-seeder';
import ChatSeeder from './chat';
import QuestionSeeder from './question';
import { times } from 'lodash';

export default class RoomSeeder extends GenericSeeder<Room> {
  room: Room;
  chatSeeders: ChatSeeder[];
  questionSeeders: QuestionSeeder[];

  constructor(public token: string, public userId: number) {
    super();
    this.create = this.create.bind(this);
  }

  async create() {
    this.room = await GenericSeeder.prototype.create.call(
      this,
      'api/rooms',
      this.token,
      {
        name: Faker.lorem.slug(),
        description: Faker.lorem.words(Faker.datatype.number(64)),
        openToJoin: Faker.datatype.boolean(),
      } as RoomCreate,
    );
    this.chatSeeders = [new ChatSeeder(this.token, this.userId, this.room)];
    this.questionSeeders = times(2).map(
      () => new QuestionSeeder(this.token, this.room.id),
    );
  }
}
