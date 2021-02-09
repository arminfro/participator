import Room from './room';

export interface AnswersFormat {
  free?: '';
  fix?: string[];
  range?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | false;
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
  text: string;
  answersFormat: AnswersFormat;
}
