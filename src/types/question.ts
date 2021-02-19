import Room from './room';

export type AnswersFormat = 'free' | 'fix' | 'range';

export default interface Question {
  id: number;
  text: string;
  room: Room;
  fixAnswers?: FixAnswer[];
  answersFormat: AnswersFormat;
  createdAt: Date;
  updatedAt: Date;
}

export interface FixAnswer {
  id: number;
  answer: string;
}

export interface QuestionCreate {
  text?: string;
  answersFormat?: AnswersFormat;
  fixAnswers?: string[];
}

export interface QuestionUpdate {
  text?: string;
  answersFormat?: AnswersFormat;
  fixAnswers?: string[];
}
