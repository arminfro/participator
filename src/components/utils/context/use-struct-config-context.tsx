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

interface UseStructConfigProps {
  children: ReactElement | ReactElement[];
}

interface UseStructContext<T, P = T> {
  onValidate?: (validationResult: ValidationResult<T>) => void;
  onLocalUpdate?: (data: P | T) => void;
  onRemoteUpdate?: (data: P | T) => void;
}

const UseStructContext = createContext({} as UseStructContext<any>);

export function useStructConfigContext<T, P = T>(): UseStructContext<T, P> {
  return useContext<UseStructContext<T, P>>(UseStructContext);
}

export function UseStructConfigProvider<T>({
  children,
}: UseStructConfigProps): ReactElement {
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
