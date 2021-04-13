import { Struct } from 'superstruct';
import { QuestionCreate, QuestionUpdate } from './question';
import { customValidate, ValidationResult } from './utils';

export function validateQuestionCreate(
  question: QuestionCreate,
): ValidationResult<QuestionCreate> {
  return validateQuestion<QuestionCreate>(question, QuestionCreate);
}

export function validateQuestionUpdate(
  question: QuestionUpdate,
): ValidationResult<QuestionUpdate> {
  return validateQuestion<QuestionUpdate>(question, QuestionUpdate);
}

export function validateQuestion<T>(
  question: T,
  struct: Struct<T>,
): ValidationResult<T> {
  return customValidate<T>(question, struct, (failure) => {
    switch (failure.key) {
      case 'text':
        failure.message = 'Question is required';
        break;
      default:
    }
    return failure;
  });
}
