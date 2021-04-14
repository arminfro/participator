import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Failure } from 'superstruct';
import { noop } from '../../../constants';
import { ValidationResult } from '../../../types/utils';
import { useStructConfigContext } from '../context/use-struct-config-context';

// utility types
type Key<T> = keyof T;
type Value<T> = T[Key<T>];
export type SetCallback<T> = (data: T) => void;

// return types
export type StateGetters<T> = { [P in keyof T]: T[P] };
type StateSetters<T> = {
  [P in keyof T]: (
    setStateAction: SetStateAction<T[P]>,
    sync?: boolean,
    callback?: SetCallback<T>,
  ) => void;
};

export interface UseStruct<T> {
  get: StateGetters<T>;
  set: StateSetters<T>;
  sync: (callback?: SetCallback<T>) => void;
  validationErrors: Failure[];
}

// param types
type States<T> = {
  [P in keyof T]: [T[P], Dispatch<SetStateAction<T[P]>>];
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
}: StructOptions<T>): UseStruct<T> {
  const [validationErrors, setValidationErrors] = useState<Failure[]>([]);
  const config = useStructConfigContext<T>();

  const struct = useMemo(() => ({ get: {}, set: {} }), []) as UseStruct<T>;

  const buildSetter = useCallback(
    (setter: Dispatch<SetStateAction<Value<T>>>, key: string) => {
      const onUpdate = (
        newValue: Value<T>,
        sync: boolean,
        callback: SetCallback<T>,
      ): Value<T> => {
        const newStruct = { ...struct.get, [key]: newValue };

        const onInvalidUpdate = () => {
          config.onLocalUpdate && config.onLocalUpdate(newStruct);
        };

        const onValidUpdate = () => {
          if ((sync || autoSync) && update) {
            update(callback, newStruct);
            config.onRemoteUpdate && config.onRemoteUpdate(newStruct);
          }
          config.onLocalUpdate && config.onLocalUpdate(newStruct);
        };

        const onValidate = (): T | void => {
          const validationResult = validator(newStruct);
          config.onValidate && config.onValidate(validationResult);
          const errors: Failure[] = validationResult[0] || [];
          const validatedModel: T = validationResult[1];
          if (errors.length) {
            setValidationErrors(errors);
          } else {
            setValidationErrors([]);
            return validatedModel;
          }
        };

        onValidate() ? onValidUpdate() : onInvalidUpdate();
        return newValue;
      };

      return (
        setStateAction: SetStateAction<Value<T>>,
        sync: boolean = !!update && autoSync,
        callback: SetCallback<T> = noop,
      ) => {
        // todo, return promise
        if (setStateAction instanceof Function) {
          setter((currentValue) => {
            const newValue = setStateAction(currentValue);
            const newStruct = onUpdate(newValue, sync, callback);
            return newStruct;
          });
        } else {
          const newValue = setStateAction;
          const newStruct = onUpdate(newValue, sync, callback);
          setter(newStruct);
        }
      };
    },
    [autoSync, validator, update, struct.get, config],
  );

  const structBuilt = useMemo(() => {
    const reducedKeys = Object.keys(states).reduce(
      (acc: UseStruct<T>, key) => {
        const [getter, setter]: [
          Value<T>,
          Dispatch<SetStateAction<Value<T>>>,
        ] = states[key];
        acc.get[key] = getter;
        acc.set[key] = buildSetter(setter, key);
        return acc;
      },
      {
        ...struct,
        sync: !update
          ? () => console.error('sync called without update function')
          : (callback = noop) => {
              if (validator(reducedKeys.get)) {
                update && update(callback, reducedKeys.get);
                config.onRemoteUpdate && config.onRemoteUpdate(reducedKeys.get);
              }
            },
        validationErrors,
      } as UseStruct<T>, // todo, better way to express
    );

    return reducedKeys;
  }, [
    config,
    struct,
    buildSetter,
    update,
    validator,
    states,
    validationErrors,
  ]);

  return structBuilt;
}
