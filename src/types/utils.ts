import { length, isEmail as isEmailValidator } from 'class-validator';
import { Failure, refine, string, Struct, validate } from 'superstruct';

export type ValidationResult<T> = [Failure[], undefined] | [undefined, T];

export const stringMinLength = (
  minLength: number,
  key: string,
): Struct<string, null> => {
  return refine(string(), key, (value) => length(value, minLength));
};

export const isEmail = (key: string): Struct<string, null> => {
  return refine(string(), key, (value) => isEmailValidator(value));
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

// could be replaced by https://github.com/piotrwitek/utility-types
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
