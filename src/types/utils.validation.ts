import { length } from 'class-validator';
import {
  define,
  Failure,
  is,
  refine,
  string,
  Struct,
  validate,
} from 'superstruct';
import { User } from './user';

export type ValidationResult<T> = [Failure[], undefined] | [undefined, T];

export const stringMinLength = (
  minLength: number,
  key: string,
): Struct<string, null> => {
  return refine(string(), key, (value) => length(value, minLength));
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

export const structs = {
  user: define('User', (value) => is(value, User)),
};
