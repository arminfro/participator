import Question from './question';
import { User } from './user';

export interface AnswerUpdate {
  freeAnswer?: string;
  fixAnswer?: string;
}

export interface AnswerCreate {
  freeAnswer?: string;
  fixAnswer?: string;
}

export default interface Answer {
  id: number;
  freeAnswer?: string;
  fixAnswer?: string;
  question: Question;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
