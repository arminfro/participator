import Room from './room';

export type AnswersFormat = 'free' | 'fix' | 'range';

export interface QuestionBase {
  id: number;
  text: string;
  room: Room;
  answersFormat: AnswersFormat;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionDBModel extends QuestionBase {
  fixAnswers: string;
}

export default interface Question extends QuestionBase {
  fixAnswers: string[];
}

export interface QuestionCreate {
  text: string;
  answersFormat: 'free' | 'fix' | 'range';
  fixAnswers: string[];
}

export interface QuestionUpdate {
  text: string;
  answersFormat: 'free' | 'fix' | 'range';
  fixAnswers: string[];
}
