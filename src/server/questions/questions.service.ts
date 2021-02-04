import { Injectable } from '@nestjs/common';
import { getManager, Repository, UpdateResult } from 'typeorm';
import { QuestionCreate, QuestionUpdate } from '../../types/question';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { Question } from './question.entity';
import QuestionsModel from '../../types/question';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(
    roomId: number,
    questionCreate: QuestionCreate,
    user: User,
  ): Promise<Question> {
    const question = await this.build(roomId, questionCreate, user);
    await getManager().save(question);
    return question;
  }

  async findAll(roomId: number): Promise<QuestionsModel[]> {
    const room = await this.findRoom(roomId);
    const questions = await getManager().find(Question, {
      where: { room },
      relations: ['user'],
    });
    return questions.map((question) => ({
      ...question,
      answersFormat: JSON.parse(question.answersFormat),
    }));
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne(id);
    return question;
  }

  update(id: number, questionUpdate: QuestionUpdate) {
    return this.questionRepository.update(id, {
      ...questionUpdate,
      answersFormat: JSON.stringify(questionUpdate.answersFormat),
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
    question.answersFormat = JSON.stringify(questionCreate.answersFormat);
    question.room = await this.findRoom(roomId);
    question.user = user;
    return question;
  }

  private async findRoom(roomId: number): Promise<Room> {
    const room = await getManager().findOne(Room, roomId);
    return room;
  }
}