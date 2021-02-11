import { QuestionDBModel } from './question';

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
  question: QuestionDBModel;
  createdAt: Date;
  updatedAt: Date;
}
