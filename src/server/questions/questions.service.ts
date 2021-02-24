import { Injectable } from '@nestjs/common';
import { getManager, Repository, UpdateResult } from 'typeorm';
import { QuestionCreate, QuestionUpdate } from '../../types/question';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { FixAnswer, Question } from './question.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) { }

  async create(
    roomId: number,
    questionCreate: QuestionCreate,
    user: User,
  ): Promise<Question> {
    const question = await this.build(roomId, questionCreate, user);
    await getManager().save(question);
    return question;
  }

  async findAll(roomId: number): Promise<Question[]> {
    const room = await this.findRoom(roomId);
    return await getManager().find(Question, {
      where: { room },
      relations: ['user', 'answers'],
    });
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne(id, {
      relations: ['answers'],
    });
    return question;
  }

  async update(id: number, questionUpdate: QuestionUpdate) {
    const fixAnswers = this.mapToFixAnswers(questionUpdate.fixAnswers);
    return this.questionRepository.update(id, {
      ...questionUpdate,
      fixAnswers,
    });
  }

  async remove(id: number): Promise<UpdateResult> {
    return await this.questionRepository.softDelete(id);
  }

  private async build(
    roomId: number,
    questionCreate: QuestionCreate,
    user: User,
  ): Promise<Question> {
    const question = new Question();
    question.text = questionCreate.text;
    question.answersFormat = questionCreate.answersFormat;
    question.fixAnswers = this.mapToFixAnswers(questionCreate.fixAnswers);
    question.room = await this.findRoom(roomId);
    question.user = user;
    return question;
  }

  private async findRoom(roomId: number): Promise<Room> {
    const room = await getManager().findOne(Room, roomId);
    return room;
  }

  private mapToFixAnswers(answers: string[]): FixAnswer[] {
    return answers.map((answer) => {
      const fixAnswer = new FixAnswer();
      fixAnswer.answer = answer;
      return fixAnswer;
    });
  }
}
