import { define, is } from 'superstruct';
import { User } from '../user';

export const UserStruct = define('User', (value) => is(value, User));
