import axios, { AxiosResponse, Method as HttpMethod } from 'axios';
import { Dispatch } from 'react';
import { toast } from 'react-toastify';
import { isUser, User, UserLogin } from '../../types/user';
import { Actions } from './store/actions';
import { getToken, setToken } from './token';

/*
 * @param method [string], http method
 * @param path [string], relative path to baseUrl
 * @param bodyData [object]
 * @return, Response Data
 */
// export function useApi<T>(
//   method: HttpMethod,
//   path: string,
// ): [T | undefined, Dispatch<SetStateAction<T>>] {
//   const [data, setData] = useState<T>();

//   useEffect(() => {
//     api<T>(method, path, (data: T) => setData(data));
//   }, [method, path]);

//   return [data, setData];
// }

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
  return axios({
    method: method,
    headers: { Authorization: `bearer ${getToken()}` },
    url: `http://localhost:3000/${path}`,
    data,
  })
    .then((response: AxiosResponse<T>) => {
      if (callback && response) {
        callback(response.data);
      } else {
        return response.data;
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
