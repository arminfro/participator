import { define, is } from 'superstruct';
import { Room } from '../room';

export const RoomStruct = define('Room', (value) => is(value, Room));
