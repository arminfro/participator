import Question from './question';
import { User } from './user';

export interface AnswerUpdate {
  rangeAnswer?: number;
  freeAnswer?: string;
  fixAnswer?: string;
}

export interface AnswerCreate {
  rangeAnswer?: number;
  freeAnswer?: string;
  fixAnswer?: string;
}

export default interface Answer {
  id: number;
  freeAnswer?: string;
  fixAnswer?: string;
  rangeAnswer?: number;
  question: Question;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
