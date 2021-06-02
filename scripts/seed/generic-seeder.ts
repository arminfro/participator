import { api } from './utils';

export default class GenericSeeder<T> {
  create<K = T>(path: string, token: string, data: K) {
    return api<T>('post', `${path}`, token, data);
  }
}
