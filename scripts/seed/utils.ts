import axios, { AxiosResponse, Method as HttpMethod } from 'axios';
import { urlWithProtocol } from '../../src/constants';
import { transformDateString } from '../../src/utils/transform-tree';

export async function api<T>(
  method: HttpMethod,
  path: string,
  token: string,
  data = {},
  headers = {},
): Promise<T | void> {
  const url = `${urlWithProtocol}/${path}`;
  console.log('url:', url, 'data:', data);
  return axios({
    method: method,
    headers: {
      Authorization: `bearer ${token}`,
      ...headers,
    },
    url,
    data,
  })
    .then((response: AxiosResponse<T>) => {
      return transformDateString<T>(response.data);
    })
    .catch((e) => {
      console.log('error at', path, 'response data:', e.response.data);
    });
}
