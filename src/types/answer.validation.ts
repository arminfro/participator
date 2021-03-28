import { Struct } from 'superstruct';
import { AnswerCreate } from './answer';
import { customValidate, ValidationResult } from './utils';

export function validateAnswerCreate(
  answer: AnswerCreate,
): ValidationResult<AnswerCreate> {
  return validateAnswer<AnswerCreate>(answer, AnswerCreate);
}

// export function validateAnswerUpdate(
//   answer: AnswerUpdate,
// ): ValidationResult<AnswerUpdate> {
//   return validateAnswer<AnswerUpdate>(answer, AnswerUpdate);
// }

export function validateAnswer<T>(
  answer: T,
  struct: Struct<T>,
): ValidationResult<T> {
  return customValidate<T>(answer, struct, (failure) => failure);
}
