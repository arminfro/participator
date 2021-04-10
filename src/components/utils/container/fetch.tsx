import React, { ReactElement, Suspense } from 'react';
import { toast } from 'react-toastify';
import useSWR, { ConfigInterface } from 'swr';

import { isDev } from '../../../utils/environment';
import LoadingSpinner from '../../shared/loading-spinner';
import ErrorBoundary from './error-boundary';
import useLocalStorage from '../hooks/use-local-storage';
import { getToken } from '../funcs/token';
import {
  SwrMutateProvider,
  useSwrMutateContext,
} from '../context/swr-mutate-context';
import { mutateCallback } from 'swr/dist/types';

interface FetchProps<T> {
  children: (data: T) => ReactElement;
  url: string;
}

export type Mutate<T> = (
  data?: T | Promise<T> | mutateCallback<T>,
  shouldRevalidate?: boolean,
) => Promise<T>;

function Fetcher<T>({ children, url }: FetchProps<T>): ReactElement {
  const keys = [url, getToken()];
  const [localStorage] = useLocalStorage<T>(keys.join());
  const swrConfig: ConfigInterface = {
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
      {children(data)}
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
