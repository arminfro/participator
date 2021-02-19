import Question from './question';
import User from './user';

export interface AnswerUpdate {
  textAnswer?: string;
  fixAnswer?: string;
}

export interface AnswerCreate {
  textAnswer?: string;
  fixAnswer?: string;
}

export default interface Answer {
  id: number;
  textAnswer?: string;
  fixAnswer?: string;
  question: Question;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
