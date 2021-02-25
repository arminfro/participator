import Answer from './answer';
import { Room } from './room';
import { User } from './user';

export type AnswersFormat = 'free' | 'fix' | 'range';

export default interface Question {
  readonly id: number;
  text: string;
  readonly answersFormat: AnswersFormat;
  readonly fixAnswers?: FixAnswer[];
  readonly room?: Room;
  readonly user?: User;
  readonly answers?: Answer[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface FixAnswer {
  id?: number;
  answer: string;
}

export interface QuestionCreate {
  text: string;
  answersFormat?: AnswersFormat;
  fixAnswers?: FixAnswer[];
  rangeOrFix: boolean;
}

export interface QuestionUpdate {
  text?: string;
  answersFormat?: AnswersFormat;
  fixAnswers?: FixAnswer[];
}
