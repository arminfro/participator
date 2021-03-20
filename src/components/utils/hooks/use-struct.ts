import { Dispatch, SetStateAction, useState } from 'react';
import { Failure } from 'superstruct';
import { noop } from '../../../constants';
import { ValidationResult } from '../../../types/utils';

// util types
type Keys<T> = keyof T;
type StringKeys<T> = Extract<Keys<T>, string>;
type Values<T> = T[Keys<T>];
export type SetCallback<T> = (data: T) => void;

// return types
type UseStruct<T> = {
  get: { [P in keyof T]: T[P] };
  set: {
    [P in keyof T]: (
      newAttr: T[P],
      sync?: boolean,
      callback?: SetCallback<T>,
    ) => T;
  };
  sync: (callback?: SetCallback<T>) => void;
};

export type UseStructWithValidation<T> = UseStruct<T> & {
  validationErrors: Failure[];
};

// param types
type States<T> = {
  [P in keyof T]: [T[P], Dispatch<T[P]>];
};

type Validator<T> = (struct: T) => ValidationResult<T>;

type Update<T> = (callback: SetCallback<T>, struct: T) => void;

interface StructOptions<T> {
  states: States<T>;
  validator?: Validator<T>;
  update?: Update<T>;
  autoSync?: boolean;
  autoValidate?: boolean;
}

export function useStruct<T>({
  states,
  validator,
  update,
  autoSync = !!update,
  autoValidate = !!validator,
}: StructOptions<T>): UseStructWithValidation<T> {
  const [validationErrors, setValidationErrors] = useState<Failure[]>([]);

  const reduceStructArg = (): UseStruct<T> => {
    const struct = Object.keys(states).reduce(
      (acc: UseStruct<T>, key: StringKeys<T>) => {
        acc.get[key] = states[key][0];
        acc.set[key] = (newValue, sync = !!update, callback = noop) => {
          return genericSetter(key, newValue, sync, states[key][1], callback);
        };
        return acc;
      },
      {
        get: {},
        set: {},
      } as UseStruct<T>, // todo, better way to express
    );
    if (validator && update) {
      struct.sync = (callback = noop) => {
        if (validator(struct.get)) {
          update(callback, struct.get);
        }
      };
    }
    return struct;
  };

  const struct = reduceStructArg();

  const buildUpdateStruct = (key: Keys<T>, newValue: Values<T>): T => {
    return { ...struct.get, [key]: newValue };
  };

  const genericSetter = (
    key: StringKeys<T>,
    newValue: Values<T>,
    sync: boolean,
    setter: Dispatch<SetStateAction<Values<T>>>,
    callback: SetCallback<T>,
  ): T => {
    const updatedStruct = buildUpdateStruct(key, newValue);
    if (validator) {
      const validationResult = validator(updatedStruct);
      const errors: Failure[] = validationResult[0] || [];
      const validatedModel: T = validationResult[1];
      if (errors.length) {
        if (!autoValidate) {
          setValidationErrors(errors);
        }
      } else {
        setValidationErrors([]);
        setter(newValue);
        update && (sync || autoSync) && update(callback, validatedModel);
        return validatedModel;
      }
    }
    callback(updatedStruct);
    setter(newValue);
    return updatedStruct;
  };

  return { ...struct, validationErrors };
}
