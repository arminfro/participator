import React, { ReactElement, Suspense } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { MutatorCallback, SWRConfiguration } from 'swr/dist/types';
import { isDev } from '../../../utils/environment';
import LoadingSpinner from '../../shared/loading-spinner';
import {
  SwrMutateProvider,
  useSwrMutateContext,
} from '../context/swr-mutate-context';
import { UseStructConfigProvider } from '../context/use-struct-config-context';
import { getToken } from '../funcs/token';
import useLocalStorage from '../hooks/use-local-storage';
import ErrorBoundary from './error-boundary';

interface FetchProps<T> {
  children: (data: T) => ReactElement;
  url: string;
}

export type Mutate<T> = (
  data?: T | Promise<T> | MutatorCallback<T>,
  shouldRevalidate?: boolean,
) => Promise<T>;

function Fetcher<T>({ children, url }: FetchProps<T>): ReactElement {
  const keys = [url, getToken()];
  const [localStorage] = useLocalStorage<T>(keys.join());
  const swrConfig: SWRConfiguration = {
    onError: (err: Error) => {
      if (isDev()) toast.error(err);
    },
  };
  if (localStorage) {
    swrConfig.initialData = localStorage;
  }
  const { data, error, mutate } = useSWR<T>(keys, swrConfig);
  if (error) console.error('error in Fetcher', error);
  return (
    <SwrMutateProvider<T>
      mutateProps={{ ...useSwrMutateContext<T>(), [url]: mutate }}
    >
      <UseStructConfigProvider>{children(data)}</UseStructConfigProvider>
    </SwrMutateProvider>
  );
}

export default function Fetch<T>(props: FetchProps<T>): ReactElement {
  return (
    <ErrorBoundary fallback={<h1>Error</h1>}>
      <Suspense fallback={<LoadingSpinner />}>
        <Fetcher<T> {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
