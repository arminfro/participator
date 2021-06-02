import * as Faker from 'faker';
import GenericSeeder from './generic-seeder';
import { Question, QuestionCreate } from '../../src/types/question';
import AnswerSeeder from './answer';
import { times } from 'lodash';

export default class QuestionSeeder extends GenericSeeder<Question> {
  token: string;
  question: Question;
  answerSeeders: AnswerSeeder[];

  constructor(userToken: string, public roomId: number) {
    super();
    this.token = userToken;
    this.create = this.create.bind(this);
  }

  async create() {
    this.question = await GenericSeeder.prototype.create.call(
      this,
      `api/rooms/${this.roomId}/questions`,
      this.token,
      {
        text: Faker.lorem.sentence(),
        answersFormat: 'free',
      } as QuestionCreate,
    );
    this.answerSeeders = times(5).map(
      () => new AnswerSeeder(this.token, this.roomId, this.question),
    );
  }
}
