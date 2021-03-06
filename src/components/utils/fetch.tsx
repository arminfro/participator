import React, { ReactElement, Suspense } from 'react';
import { toast } from 'react-toastify';
import useSWR, { ConfigInterface } from 'swr';
import { mutateCallback } from 'swr/dist/types';
import { isDev } from '../../utils/environment';
import LoadingSpinner from '../shared/loading-spinner';
import ErrorBoundary from './error-boundary';
import useLocalStorage from './hooks/use-local-storage';
import { getToken } from './token';

interface FetchProps<T> {
  children: (data: T, mutate: MutateFunc<T>) => ReactElement;
  url: string;
}

export type MutateFunc<T> = (
  data?: T | Promise<T> | mutateCallback<T>,
  shouldRevalidate?: boolean,
) => Promise<T | undefined>;

function Fetcher<T>({ children, url }: FetchProps<T>): ReactElement {
  const key = [url, getToken()];
  const [localStorage, setLocalStorage] = useLocalStorage<T>(key.join());
  const swrConfig: ConfigInterface = {
    onSuccess: (response: any) => {
      setLocalStorage(response);
      if (isDev()) toast.info(`Fetched ${url}`);
    },
    onError: (err: Error) => {
      if (isDev()) toast.error(err);
    },
  };
  if (localStorage) {
    swrConfig.initialData = localStorage;
  }
  const { data, mutate, error } = useSWR<T>(key, swrConfig);
  if (error) console.error('error in Fetcher', error);
  return children(data, mutate);
}

export default function Fetch<T>(props: FetchProps<T>): ReactElement {
  return (
    <ErrorBoundary fallback={<h1>Error</h1>}>
      <Suspense fallback={<LoadingSpinner />}>
        <Fetcher {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
