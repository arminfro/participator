import {
  any,
  array,
  date,
  define,
  Describe,
  number,
  object,
  optional,
  string,
} from 'superstruct';
import { Answer } from './answer';
import { Room } from './room';
import { User } from './user';

export type AnswersFormat = 'free' | 'fix';
export const AnswersFormat = define<AnswersFormat>('AnswersFormat', (value) =>
  value === 'free' || value === 'fix');

export interface FixAnswer {
  id?: number;
  text: string;
}
export const FixAnswer: Describe<FixAnswer> = object({
  id: optional(number()),
  text: string(),
});

export type Question = {
  readonly id: number;
  text: string;
  readonly answersFormat: AnswersFormat;
  readonly fixAnswers?: FixAnswer[];
  readonly room?: Room;
  readonly user?: User;
  readonly answers?: Answer[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
export const Question: Describe<Question> = object({
  id: number(),
  text: string(),
  answersFormat: AnswersFormat,
  fixAnswers: optional(array(FixAnswer)),
  room: optional(any()),
  user: optional(any()),
  answers: optional(array(any())),
  createdAt: optional(date()),
  updatedAt: optional(date()),
});

export type QuestionCreate = {
  text: string;
  answersFormat: AnswersFormat;
  fixAnswers?: FixAnswer[];
};

const questionCreateProps = {
  text: string(),
  answersFormat: AnswersFormat,
  fixAnswers: optional(
    array(object({ id: optional(number()), text: string() })),
  ),
};
export const QuestionCreate: Describe<QuestionCreate> = object(
  questionCreateProps,
);

export type QuestionUpdate = {
  text?: string;
  answersFormat?: AnswersFormat;
  fixAnswers?: FixAnswer[];
};
export const QuestionUpdate: Describe<QuestionUpdate> = object({
  ...questionCreateProps,
  text: optional(string()),
});
