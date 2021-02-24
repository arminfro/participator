const key = 'access_token';

export function setToken(token: string): void {
  token && window.localStorage.setItem(key, token);
}

export function removeToken(): void {
  window.localStorage.removeItem(key);
}

export function getToken(): string {
  return window.localStorage.getItem(key);
}
