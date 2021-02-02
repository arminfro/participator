import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository, UpdateResult } from 'typeorm';
import { AnswerCreate, AnswerUpdate } from '../../types/answer';
import { Question } from '../questions/question.entity';
import { User } from '../users/user.entity';
import { Answer } from './answer.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

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

  async findOne(id: number): Promise<Answer> {
    const answer = await this.answerRepository.findOne(id);
    return answer;
  }

  async update(id: number, answerUpdate: AnswerUpdate): Promise<UpdateResult> {
    return await this.answerRepository.update(id, answerUpdate);
  }

  async remove(id: number): Promise<UpdateResult> {
    return await this.answerRepository.softDelete(id);
  }

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
