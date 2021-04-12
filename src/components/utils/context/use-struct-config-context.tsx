import router from 'next/router';
import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
} from 'react';
import { ValidationResult } from '../../../types/utils';
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
        mutate[`api${router.asPath}`]((currentData: T) => {
          return { ...currentData, ...newStruct };
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
