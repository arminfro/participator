import React, { ReactElement, Suspense } from 'react';
import useSWR from 'swr';
import ErrorBoundary from './error-boundary';
import LoadingSpinner from '../shared/loading-spinner';
import { getToken } from './token';

interface FetchProps<T> {
  children: (data: T) => ReactElement;
  url: string;
}

function Fetcher<T>({ children, url }: FetchProps<T>): ReactElement {
  const { data, error, isValidating } = useSWR([url, getToken()]);
  console.log('data', data, 'error', error, 'isValidating', isValidating);
  if (error) {
    debugger;
  }
  // if (!data) return <div>loading...</div>;
  // if (!window) return <LoadingSpinner />;
  return children(data.data);
}

export default function Fetch<T>(props: FetchProps<T>): ReactElement {
  return (
    <ErrorBoundary fallback={<h1> Error</h1>}>
      <Suspense fallback={<LoadingSpinner />}>
        <Fetcher {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
