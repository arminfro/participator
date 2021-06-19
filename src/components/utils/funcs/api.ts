import axios, { AxiosResponse, AxiosError, Method as HttpMethod } from 'axios';
import { urlWithProtocol } from '../../../constants';
import { isUser, User, UserLogin } from '../../../types/user';
import { transformDateString } from '../../../utils/transform-tree';
import { getToken } from './token';

export interface ApiError {
  path: string;
  message: string;
  status: number;
}

function axiosCatch(error: AxiosError) {
  if (error.response?.data?.path === '/api/users/token-to-user') {
    console.debug('Invalid token, may due to server side rendering');
    return;
  }
  throw (
    error.response?.data ||
    ({
      path: error.config.url,
      message: error.message,
      status: error.request.status,
    } as ApiError)
  );
}

export async function swrApi(path: string) {
  return axios({
    method: 'GET',
    headers: { Authorization: `bearer ${getToken()}` },
    url: `${urlWithProtocol}/${path}`,
  })
    .then((resp) => transformDateString(resp.data))
    .catch(axiosCatch);
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
  data = {},
): Promise<T | void> {
  return axios({
    method: method,
    headers: {
      Authorization: `bearer ${getToken()}`,
    },
    url: `${urlWithProtocol}/${path}`,
    data,
  })
    .then((response: AxiosResponse<T>) => {
      return transformDateString<T>(response.data);
    })
    .catch(axiosCatch);
}

export async function apiLogin(
  payload: UserLogin,
): Promise<{ access_token: string; user: User }> {
  return api<{ access_token: string; user: User }>(
    'POST',
    'login',
    payload,
  ).then((payload) => {
    if (payload && isUser(payload.user)) return payload;
    return Promise.reject('login failed');
  });
}
