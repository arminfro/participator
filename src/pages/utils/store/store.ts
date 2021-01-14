import User from '../../../types/user';

export default interface Store {
  user?: User;
}

export function initializeStore(): Store {
  return {};
}
