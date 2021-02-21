import { define, is } from 'superstruct';
import { Chat } from '../chat';

export const ChatStruct = define('Chat', (value) => is(value, Chat));
