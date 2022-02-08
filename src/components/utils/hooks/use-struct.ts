import { forEach } from 'lodash';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Failure } from 'superstruct';
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
  get: T;
  set: StateSetters<T>;
  sync: () => Promise<T>;
  initialValues: T;
  setToInitialState: () => void;
  isEdit: boolean;
  validationErrors: Failure[];
}

// param types
type States<T> = {
  [P in keyof T]: [T[P], Dispatch<SetStateAction<T[P]>>];
};

type Validator<T> = (struct: T) => ValidationResult<T>;

type RemoteUpdate<T, P> = (struct: T) => Promise<P | void>;

interface StructOptions<T, P> {
  states: States<T>;
  validator?: Validator<T>;
  remoteUpdate?: RemoteUpdate<T, P>;
  initialValues?: T;
  afterRemoteUpdate?: (requestPayload: T | P, responsePayload: T | P) => any;
  autoSync?: boolean;
  isEdit?: boolean;
}

export function useStruct<T extends Partial<Record<Key<T>, Value<T>>>, P = T>({
  states,
  validator,
  remoteUpdate,
  afterRemoteUpdate,
  initialValues,
  autoSync = false,
  isEdit = false,
}: StructOptions<T, P>): UseStruct<T> {
  const struct = useMemo(() => ({ get: {}, set: {} }), []) as UseStruct<T>;
  const config = useStructConfigContext<T, P>();

  const [validationErrors, setValidationErrors] = useState<Failure[]>(
    validator(
      Object.keys(states).reduce(
        (acc, key) => ({ ...acc, [key]: states[key][0] }),
        {} as T,
      ),
    )[0] || [],
  );

  const mutate = useCallback(
    (data: T | P) =>
      afterRemoteUpdate ? afterRemoteUpdate(data, struct.get) : data,
    [afterRemoteUpdate, struct.get],
  );

  const remoteUpdateWrapper = useCallback(
    (newStruct: T) =>
      (remoteUpdate ? remoteUpdate : Promise.resolve.bind(Promise))(
        newStruct,
      ).then((data: T | P | void) => {
        if (data) {
          config.afterRemoteUpdate && config.afterRemoteUpdate(mutate(data));
          return data;
        }
      }),
    [config, remoteUpdate, mutate],
  );

  const onValidate = useMemo(() => {
    // console.log('building onValidate');
    return (newStruct: Partial<T>): T | void => {
      const validationResult = validator({ ...struct.get, ...newStruct });
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
  }, [config, validator, struct.get]);

  const buildSetter = useMemo(() => {
    // console.log('build Setter');
    return (setter: Dispatch<SetStateAction<Value<T>>>, key: string) => {
      const onUpdate = (newValue: Value<T>, sync: boolean): Value<T> => {
        const newStruct = { ...struct.get, [key]: newValue };

        const remoteUpdate = () => {
          remoteUpdateWrapper(newStruct);
        };

        onValidate(newStruct) && (sync || autoSync) && remoteUpdate();
        return newValue;
      };

      return (
        setStateAction: SetStateAction<Value<T>>,
        doRemoteUpdate = !!remoteUpdate && autoSync,
      ) => {
        if (setStateAction instanceof Function) {
          setter((currentValue) => {
            const newValue = setStateAction(currentValue);
            const newStruct = onUpdate(newValue, doRemoteUpdate);
            return newStruct;
          });
        } else {
          const newValue = setStateAction;
          const newStruct = onUpdate(newValue, doRemoteUpdate);
          setter(newStruct);
        }
      };
    };
  }, [autoSync, onValidate, remoteUpdateWrapper, remoteUpdate, struct.get]);

  const structBuilt = useMemo(() => {
    const reducedKeys = Object.keys(states).reduce(
      (acc: UseStruct<T>, key) => {
        const [getter, setter]: [Value<T>, Dispatch<SetStateAction<Value<T>>>] =
          states[key];
        acc.get[key] = getter;
        acc.set[key] = buildSetter(setter, key);
        return acc;
      },
      { ...struct },
    );

    return reducedKeys;
  }, [states, struct, buildSetter]);

  return {
    ...structBuilt,
    validationErrors,
    isEdit,
    initialValues,
    setToInitialState: () => {
      forEach<T>(initialValues, (value, key) => {
        struct.set[key](value);
      });
    },
    sync: async () => {
      if (validator(struct.get)) {
        return remoteUpdateWrapper(struct.get);
      }
    },
  };
}
