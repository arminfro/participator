import {
  any,
  array,
  boolean,
  date,
  Describe,
  is,
  number,
  object,
  optional,
  string,
  validate,
} from 'superstruct';
import { Chat } from './chat';
import { Question } from './question';
import { User } from './user';
import { stringMinLength } from './utils';

export type RoomCreate = {
  name: string;
  description?: string;
  openToJoin: boolean;
  admin?: User;
};
export const RoomCreate: Describe<RoomCreate> = object({
  name: stringMinLength(3, 'name'),
  description: optional(string()),
  openToJoin: boolean(),
  admin: optional(User),
});

export type RoomUpdate = Partial<Exclude<RoomCreate, 'admin'>> & {
  addMember?: User;
  removeMember?: User;
};
export const RoomUpdate: Describe<RoomUpdate> = object({
  addMember: optional(User),
  removeMember: optional(User),
  name: optional(stringMinLength(3, 'name')),
  description: optional(string()),
  openToJoin: optional(boolean()),
});

export type Room = {
  readonly id: number;
  name: string;
  description?: string;
  openToJoin: boolean;
  readonly members?: User[];
  readonly admin?: User;
  readonly chat?: Chat;
  readonly questions?: Question[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
export const Room: Describe<Room> = object({
  id: number(),
  name: string(),
  description: optional(string()),
  openToJoin: boolean(),
  members: optional(array(any())),
  admin: optional(any()),
  chat: optional(any()),
  questions: optional(array(any())),
  createdAt: optional(date()),
  updatedAt: optional(date()),
});

export enum JoinConditions {
  Open = 'open-to-join',
  Closed = 'invite-to-join',
}

export function isRoom(room: Room) {
  if (is(room, Room)) {
    return true;
  } else {
    console.debug("isn't a Room:", validate(room, Room));
    return false;
  }
}
