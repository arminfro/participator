import { useRouter } from 'next/router';
import { Dispatch, useCallback, useEffect, useState } from 'react';

export const useQueryParams = <T>(
  action: string,
  defaultValue: T,
  serializer: (arg: T) => string = JSON.stringify,
  deserializer: (arg: string) => T = JSON.parse,
): [T, Dispatch<T>] => {
  const router = useRouter();
  const [data, setData] = useState<T>(defaultValue);

  const setDataAndQuery: Dispatch<T> = (data) => {
    router.query[action] = serializer(data);
    router.push(router);
  };

  useEffect(() => {
    if (router.query[action]) {
      setData(deserializer(router.query[action] as string));
    }
  }, [router.query, action, deserializer]);

  return [data, setDataAndQuery];
};

export const useQueryParamsBoolean = (action: string, defaultValue: boolean) =>
  useQueryParams<boolean>(
    action,
    defaultValue,
    useCallback((boolean) => (boolean ? 'true' : 'false'), []),
    useCallback(
      (booleanString) => (booleanString === 'true' ? true : false),
      [],
    ),
  );
