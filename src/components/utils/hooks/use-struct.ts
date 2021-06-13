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
  const [validationErrors, setValidationErrors] = useState<Failure[]>([]);
  const config = useStructConfigContext<T, P>();

  const struct = useMemo(() => ({ get: {}, set: {} }), []) as UseStruct<T>;

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

  const buildSetter = useCallback(
    (setter: Dispatch<SetStateAction<Value<T>>>, key: string) => {
      const onUpdate = (newValue: Value<T>, sync: boolean): Value<T> => {
        const newStruct = { ...struct.get, [key]: newValue };

        const remoteUpdate = () => {
          remoteUpdateWrapper(newStruct);
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

        onValidate() && (sync || autoSync) && remoteUpdate();
        return newValue;
      };

      return (
        setStateAction: SetStateAction<Value<T>>,
        doRemoteUpdate: boolean = !!remoteUpdate && autoSync,
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
    },
    [
      autoSync,
      validator,
      remoteUpdateWrapper,
      remoteUpdate,
      struct.get,
      config,
    ],
  );

  const structBuilt = useMemo(() => {
    const reducedKeys = Object.keys(states).reduce(
      (acc: UseStruct<T>, key) => {
        const [getter, setter]: [Value<T>, Dispatch<SetStateAction<Value<T>>>] =
          states[key];
        acc.get[key] = getter;
        acc.set[key] = buildSetter(setter, key);
        return acc;
      },
      {
        ...struct,
        sync: async () => {
          if (validator(reducedKeys.get)) {
            return remoteUpdateWrapper(reducedKeys.get);
          }
        },
        isEdit,
        initialValues,
        setToInitialState: () => {
          forEach<T>(initialValues, (value, key) => {
            struct.set[key](value);
          });
        },
        validationErrors,
      },
    );

    return reducedKeys;
  }, [
    struct,
    buildSetter,
    isEdit,
    initialValues,
    validator,
    states,
    validationErrors,
    remoteUpdateWrapper,
  ]);

  return structBuilt;
}
