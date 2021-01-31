import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { AnswerCreate } from '../../types/answer';
import { Question } from '../questions/question.entity';
import { User } from '../users/user.entity';
import { Answer } from './answer.entity';

@Injectable()
export class AnswersService {
  async create(answerCreate: AnswerCreate, questionId: number, user: User) {
    const answer = await this.build(questionId, answerCreate, user);
    await getManager().save(answer);
    return answer;
  }

  async findAll(questionId: number): Promise<Answer[]> {
    const question = await this.findQuestion(questionId);
    return await getManager().find(Answer, {
      where: { question },
      relations: ['user'],
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} answer`;
  // }

  // update(id: number, answerUpdate: AnswerUpdate) {
  //   return `This action updates a #${id} answer`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} answer`;
  // }

  private async build(
    questionId: number,
    answerCreate: AnswerCreate,
    user: User,
  ): Promise<Answer> {
    const answer = new Answer();
    answer.textAnswer = answerCreate.textAnswer;
    answer.fixedAnswer = answerCreate.fixedAnswer;
    answer.question = await this.findQuestion(questionId);
    answer.user = user;
    return answer;
  }

  private async findQuestion(questionId: number): Promise<Question> {
    const room = await getManager().findOne(Question, questionId);
    return room;
  }
}
