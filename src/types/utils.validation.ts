import { isNotEmpty, length } from 'class-validator';
import { Failure, refine, string, Struct, validate } from 'superstruct';

export type ValidationResult<T> = [Failure[] | undefined, T | undefined];

export const stringLengthGtTwo = (key: string): Struct<string, null> => {
  return refine(
    string(),
    key,
    (value) => isNotEmpty(value) && length(value, 2),
  );
};

export function customValidate<T>(
  model: T,
  struct: Struct<T>,
  mapping: (failure: Failure) => Failure,
): ValidationResult<T> {
  const [errors, validModel] = validate(model, struct);
  if (errors) {
    const failures = errors.failures().map(mapping);
    return [failures, undefined];
  } else {
    return [undefined, validModel];
  }
}
