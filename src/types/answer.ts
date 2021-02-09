import { QuestionDBModel } from './question';

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
  question: QuestionDBModel;
  createdAt: Date;
  updatedAt: Date;
}
