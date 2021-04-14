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
    private questionRepository: Repository<Question>,
    @InjectRepository(FixAnswer)
    private fixAnswerRepository: Repository<FixAnswer>,
  ) {}

  async create(
    roomId: number,
    questionCreate: QuestionCreate,
    user: User,
  ): Promise<Question> {
    const question = await this.buildAndCreate(roomId, questionCreate, user);
    return this.findOne(question.id);
  }

  async findAll(roomId: number): Promise<Question[]> {
    const room = await this.findRoom(roomId);
    return this.questionRepository.find({
      where: { room },
      relations: ['user', 'answers', 'fixAnswers'],
    });
  }

  async findOne(id: number): Promise<Question> {
    return this.questionRepository.findOne(id, {
      relations: ['fixAnswers', 'room'],
    });
  }

  async update(id: number, questionUpdate: QuestionUpdate) {
    const question = await this.questionRepository.findOne(id, {
      relations: ['fixAnswers'],
    });
    const { fixAnswers, ...questionUpdateStripped } = questionUpdate;
    if (questionUpdate.fixAnswers) {
      fixAnswers
        .filter((fixAnswer) => fixAnswer.id)
        .forEach((fixAnswer) => {
          return this.fixAnswerRepository.update(fixAnswer.id, fixAnswer);
        });

      const newFixAnswers = fixAnswers.filter((fixAnswer) => !fixAnswer.id);
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
      this.createFixAnswers(questionCreate.fixAnswers, {
        ...question,
        fixAnswers: [],
      } as Question);
    return question;
  }

  private async findRoom(roomId: number): Promise<Room> {
    const room = await getManager().findOne(Room, roomId);
    return room;
  }

  private createFixAnswers(fixAnswers: IFixAnswer[], question: Question): void {
    const uniqueFixAnswers = fixAnswers.reduce((acc, fixAnswer) => {
      acc.find((fixA) => fixA.text === fixAnswer.text) || acc.push(fixAnswer);
      return acc;
    }, [] as IFixAnswer[]);

    uniqueFixAnswers.forEach((answer) => {
      if (
        !question.fixAnswers.some((fixAnswer) => fixAnswer.id === answer.id)
      ) {
        const fixAnswer = new FixAnswer();
        fixAnswer.text = answer.text;
        fixAnswer.question = question;
        fixAnswer.save();
        return fixAnswer;
      }
    });
  }
}
