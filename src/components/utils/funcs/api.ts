import axios, { AxiosResponse, Method as HttpMethod } from 'axios';
import { Dispatch } from 'react';
import { toast } from 'react-toastify';
import { urlWithProtocol } from '../../../constants';
import { isUser, User, UserLogin } from '../../../types/user';
import { transformDateString } from '../../../utils/transform-tree';
import { Actions } from '../store/actions';
import { getToken, setToken } from './token';

export async function swrApi(path: string) {
  return axios({
    method: 'GET',
    headers: { Authorization: `bearer ${getToken()}` },
    url: `${urlWithProtocol}/${path}`,
  }).then((resp) => transformDateString(resp.data));
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
    headers: { Authorization: `bearer ${getToken()}` },
    url: `${urlWithProtocol}/${path}`,
    data,
  })
    .then((response: AxiosResponse<T>) => {
      return transformDateString<T>(response.data);
    })
    .catch((error) => {
      if (!/token-to-user$/.test(error.config.url)) {
        throw error;
      }
    });
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
