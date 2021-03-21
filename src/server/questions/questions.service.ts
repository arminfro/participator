import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository, UpdateResult } from 'typeorm';

import {
  FixAnswer as IFixAnswer,
  QuestionCreate,
  QuestionUpdate,
} from '../../types/question';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { Question } from './question.entity';

import { FixAnswer } from './fix-answer.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>, //todo, dependency issue, needed for update @InjectRepository(FixAnswer) private fixAnswerRepositroy: Repository<FixAnswer>,
  ) {}

  async create(
    roomId: number,
    questionCreate: QuestionCreate,
    user: User,
  ): Promise<Question> {
    const question = await this.buildAndCreate(roomId, questionCreate, user);
    return question;
  }

  async findAll(roomId: number): Promise<Question[]> {
    const room = await this.findRoom(roomId);
    return await getManager().find(Question, {
      where: { room },
      relations: ['user', 'answers', 'fixAnswers'],
    });
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne(id, {
      relations: ['answers', 'fixAnswers'],
    });
    return question;
  }

  async update(id: number, questionUpdate: QuestionUpdate) {
    const question = await this.questionRepository.findOne(id, {
      relations: ['fixAnswers'],
    });
    const { fixAnswers, ...questionUpdateStripped } = questionUpdate;
    if (questionUpdate.fixAnswers) {
      const newFixAnswers = fixAnswers.filter((fixAnswer) => !fixAnswer.id);
      // fixAnswers
      //   .filter((fixAnswer) => fixAnswer.id)
      //   .forEach((fixAnswer) =>
      //     this.fixAnswerRepository.update(fixAnswer.id, fixAnswer),
      //   );
      if (newFixAnswers.length) {
        this.createFixAnswers(newFixAnswers, question);
      }
    }
    await this.questionRepository.update(id, questionUpdateStripped);
    return question;
  }

  async remove(id: number): Promise<UpdateResult> {
    return await this.questionRepository.softDelete(id);
  }

  private async buildAndCreate(
    roomId: number,
    questionCreate: QuestionCreate,
    user: User,
  ): Promise<Question> {
    const question = new Question();
    question.text = questionCreate.text;
    if (questionCreate.answersFormat)
      question.answersFormat = questionCreate.answersFormat;
    question.room = await this.findRoom(roomId);
    question.user = user;
    await this.questionRepository.save(question);
    questionCreate.fixAnswers &&
      this.createFixAnswers(questionCreate.fixAnswers, question);
    return question;
  }

  private async findRoom(roomId: number): Promise<Room> {
    const room = await getManager().findOne(Room, roomId);
    return room;
  }

  private createFixAnswers(
    fixAnswers: IFixAnswer[],
    question?: Question,
  ): FixAnswer[] {
    return fixAnswers.map((answer) => {
      const fixAnswer = new FixAnswer();
      fixAnswer.answer = answer.answer;
      if (question) {
        fixAnswer.question = question;
      }
      fixAnswer.save();
      return fixAnswer;
    });
  }
}
