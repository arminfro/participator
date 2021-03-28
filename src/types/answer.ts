import {
  any,
  date,
  Describe,
  number,
  object,
  optional,
  string,
} from 'superstruct';
import { FixAnswer, Question } from './question';
import { User } from './user';

// export type AnswerUpdate = {
//   freeAnswer?: string;
//   fixAnswerId?: number;
// };
// export const AnswerUpdate: Describe<AnswerUpdate> = object({
//   freeAnswer: optional(string()),
//   fixAnswerId: optional(number()),
// });

export interface AnswerCreate {
  freeAnswer?: string;
  fixAnswerId?: number;
}
export const AnswerCreate: Describe<AnswerCreate> = object({
  freeAnswer: optional(string()),
  fixAnswerId: optional(number()),
});

export interface Answer {
  id: number;
  freeAnswer?: string;
  fixAnswer?: FixAnswer;
  question?: Question;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
export const Answer: Describe<Answer> = object({
  id: number(),
  freeAnswer: optional(string()),
  fixAnswer: optional(any()),
  question: optional(any()),
  user: optional(any()),
  createdAt: optional(date()),
  updatedAt: optional(date()),
});
