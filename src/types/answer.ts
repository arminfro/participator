import Question from './question';

export interface AnswerUpdate {
  textAnswer?: string;
  fixedAnswer?: string;
}

export interface AnswerCreate {
  textAnswer?: string;
  fixedAnswer?: string;
}

export default interface Answer {
  id: number;
  textAnswer?: string;
  fixedAnswer?: string;
  question: Question;
  createdAt: Date;
  updatedAt: Date;
}
