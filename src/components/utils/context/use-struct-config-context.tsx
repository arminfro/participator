import router from 'next/router';
import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
} from 'react';
import { array, is, object } from 'superstruct';
import { ValidationResult } from '../../../types/utils';
import { transformDateString } from '../../../utils/transform-tree';
import { useSwrMutateContext } from './swr-mutate-context';

interface UseStructConfigProps<T> {
  // config: UseStructContext<T>;
  children: ReactElement | ReactElement[];
}

interface UseStructContext<T> {
  onValidate?: (validationResult: ValidationResult<T>) => void;
  onLocalUpdate?: (data: T) => void;
  onRemoteUpdate?: (data: T) => void;
}

const UseStructContext = createContext({} as UseStructContext<any>);

export function useStructConfigContext<T>(): UseStructContext<T> {
  return useContext<UseStructContext<T>>(UseStructContext);
}

export function UseStructConfigProvider<T>({
  children,
}: UseStructConfigProps<T>): ReactElement {
  const mutate = useSwrMutateContext();

  const onRemoteUpdate = useCallback(
    (newStruct) => {
      if (mutate[`api${router.asPath}`]) {
        const newData = transformDateString(newStruct);
        mutate[`api${router.asPath}`]((currentData: T) => {
          if (is(currentData, array(object()))) {
            return [newData, ...currentData];
          }
          return { ...currentData, ...newData };
        }, false);
      }
    },
    [mutate],
  );

  return (
    <UseStructContext.Provider value={{ onRemoteUpdate }}>
      {children}
    </UseStructContext.Provider>
  );
}
