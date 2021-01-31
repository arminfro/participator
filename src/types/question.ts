import Room from './room';

export interface AnswersFormat {
  any?: '';
  fixed?: string[];
}

export default interface Question {
  id: number;
  text: string;
  room: Room;
  answersFormat: AnswersFormat | string; //quick fix, sqlite doesnt support json column
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionCreate {
  text: string;
  answersFormat: AnswersFormat;
}

export interface QuestionUpdate {
  id: number;
  text: string;
  answersFormat: AnswersFormat;
}
