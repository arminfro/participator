import { FixAnswer, Question } from './question';
import { User } from './user';

export interface AnswerUpdate {
  freeAnswer?: string;
  fixAnswerId?: number;
}

export interface AnswerCreate {
  freeAnswer?: string;
  fixAnswerId?: number;
}

export default interface Answer {
  id: number;
  freeAnswer?: string;
  fixAnswer?: FixAnswer;
  question: Question;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
