import * as Faker from 'faker';
import GenericSeeder from './generic-seeder';
import { Answer, AnswerCreate } from '../../src/types/answer';
import { Question } from '../../src/types/question';

export default class AnswerSeeder extends GenericSeeder<Answer> {
  token: string;
  answer: Answer;

  constructor(
    userToken: string,
    public roomId: number,
    public question: Question,
  ) {
    super();
    this.token = userToken;
    this.create = this.create.bind(this);
  }

  async create() {
    this.answer = await GenericSeeder.prototype.create.call(
      this,
      `api/rooms/${this.roomId}/questions/${this.question.id}/answers`,
      this.token,
      {
        freeAnswer: Faker.lorem.sentences(3),
      } as AnswerCreate,
    );
  }
}
