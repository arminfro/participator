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
  callback: (data: T) => void | undefined = undefined,
  data = {},
) {
  return axios({
    method: method,
    headers: { Authorization: `bearer ${getToken()}` },
    url: `${urlWithProtocol}/${path}`,
    data,
  })
    .then((response: AxiosResponse<T>) => {
      const data = transformDateString<T>(response.data);
      if (callback && response) {
        callback(data);
      } else {
        return data;
      }
    })
    .catch((error) => {
      if (!/token-to-user$/.test(error.config.url)) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          throw error;
        }
      }
    });
}

export async function apiLogin(
  dispatch: Dispatch<Actions>,
  payload: UserLogin,
  successCallback: () => void = null,
  failureCallback: () => void = null,
): Promise<void> {
  api<{ access_token: string; user: User }>(
    'POST',
    'login',
    ({ access_token, user }) => {
      if (access_token && isUser(user)) {
        dispatch({ type: 'LOGIN', user });
        setToken(access_token);
        successCallback && successCallback();
      } else {
        failureCallback && failureCallback();
      }
    },
    payload,
  ).catch((err) => {
    if (failureCallback) {
      failureCallback();
    } else {
      throw err;
    }
  });
}
