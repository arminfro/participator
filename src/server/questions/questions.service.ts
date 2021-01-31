import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { QuestionCreate } from '../../types/question';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { Question } from './question.entity';
import QuestionsModel from '../../types/question';

@Injectable()
export class QuestionsService {
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

  // findOne(id: number) {
  // return `This action returns a #${id} question`;
  // }

  // update(id: number, questionUpdate: QuestionUpdate) {
  // return `This action updates a #${id} question`;
  // }

  // remove(id: number) {
  // return `This action removes a #${id} question`;
  // }

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
