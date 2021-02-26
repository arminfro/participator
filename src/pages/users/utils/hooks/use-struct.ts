import { Dispatch, SetStateAction, useState } from 'react';
import { Failure } from 'superstruct';
import { ValidationResult } from '../../../../types/utils';

type Keys<T> = keyof T;
type StringKeys<T> = Extract<Keys<T>, string>;
type Values<T> = T[Keys<T>];
export type SetCallback<T> = (data: T) => void;

type UseStruct<T> = {
  get: { [P in keyof T]: T[P] };
  set: {
    [P in keyof T]: (
      newAttr: T[P],
      sync?: boolean,
      callback?: SetCallback<T>,
    ) => T;
  };
};

type UseStructArg<T> = {
  [P in keyof T]: [T[P], Dispatch<T[P]>];
};

type ValidatorArg<T> = false | ((struct: T) => ValidationResult<T>);

type RemoteUpdateArg<T> =
  | false
  | ((callback: SetCallback<T>, struct: T) => void);

export type UseStructWithValidation<T> = UseStruct<T> & {
  validationErrors: Failure[];
};

export function useStruct<T>(
  structArg: UseStructArg<T>,
  validator: ValidatorArg<T>,
  remoteUpdate: RemoteUpdateArg<T>,
): UseStructWithValidation<T> {
  const [validationErrors, setValidationErrors] = useState<Failure[]>([]);

  const reduceStructArg = (): UseStruct<T> => {
    return Object.keys(structArg).reduce(
      (acc: UseStruct<T>, key: StringKeys<T>) => {
        acc.get[key] = structArg[key][0];
        acc.set[key] = (
          newValue,
          sync = !!remoteUpdate,
          callback = (): void => {
            /* no-op */
          },
        ) => {
          return genericSetter(
            key,
            newValue,
            sync,
            structArg[key][1],
            callback,
          );
        };
        return acc;
      },
      {
        get: {},
        set: {},
      } as UseStruct<T>, // todo, better way to express
    );
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
        setValidationErrors(errors);
      } else {
        setValidationErrors([]);
        setter(newValue);
        remoteUpdate && sync && remoteUpdate(callback, validatedModel);
        return validatedModel;
      }
    }
    callback(updatedStruct);
    setter(newValue);
    return updatedStruct;
  };

  return { ...struct, validationErrors };
}
