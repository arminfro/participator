import axios, { Method as HttpMethod } from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getToken } from './token';

/*
 * @param method [string], http method
 * @param path [string], relative path to baseUrl
 * @param bodyData [object]
 * @return, Response Data
 */
export function useApi<T>(
  method: HttpMethod,
  path: string,
): [T | undefined, Dispatch<SetStateAction<T>>] {
  const [data, setData] = useState<T>();

  useEffect(() => {
    api<T>(method, path, (data: T) => setData(data));
  }, [method, path]);

  return [data, setData];
}

/*
 * Useful for calls on events or in condition
 *
 * @param method [string], http method
 * @param path [string], relative path to baseUrl
 * @param data [function], callback, gets `response.data` as an argument
 * @param data [object], body data
 */
export default async function api<T>(
  method: HttpMethod,
  path: string,
  callback: (data: T) => void | undefined = undefined,
  data = {},
): Promise<T | void> {
  const response = await axios({
    method: method,
    headers: { Authorization: `bearer ${getToken()}` },
    url: `http://localhost:3000/${path}`,
    data,
  }).catch((err) => {
    console.error('error', err);
    throw err;
  });
  if (callback) {
    callback(response.data);
  } else {
    return response.data;
  }
}
