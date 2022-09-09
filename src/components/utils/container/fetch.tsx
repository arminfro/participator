// import { message } from 'antd';
import React, { ReactElement, Suspense } from 'react';
import useSWR from 'swr';
import { MutatorCallback, SWRConfiguration } from 'swr/dist/types';
import Exception from '../../../pages/exception';
// import { isDev } from '../../../utils/environment';
import LoadingSpinner from '../../shared/loading-spinner';
import {
  SwrMutateProvider,
  useSwrMutateContext,
} from '../context/swr-mutate-context';
import { UseStructConfigProvider } from '../context/use-struct-config-context';
import { getToken } from '../funcs/token';
import useLocalStorage from '../hooks/use-local-storage';
import ErrorBoundary from './error-boundary';

export interface FetchProps<T> {
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
      // if (isDev()) message.error(err);
    },
  };
  if (localStorage) {
    swrConfig.fallback = localStorage;
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
    <ErrorBoundary
      fallback={(e) =>
        'status' in e && 'message' in e && 'path' in e ? (
          <Exception
            status={String(e.status)}
            message={e.message}
            path={e.path}
          />
        ) : (
          <p>{JSON.stringify(e)}</p>
        )
      }
    >
      <Suspense fallback={<LoadingSpinner />}>
        <Fetcher<T> {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
