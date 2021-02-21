import {
  any,
  array,
  date,
  Infer,
  lazy,
  number,
  object,
  optional,
  string,
} from 'superstruct';
import { ChatStruct } from './structs/chat.struct';
import { RoomStruct } from './structs/room.struct';
import { UserStruct } from './structs/user.struct';
import { PartialBy } from './utils';

export type ChatCreate = PartialBy<Infer<typeof ChatCreate>, 'parentId'>;
export const ChatCreate = object({
  parentId: optional(number()),
  userId: number(),
  msg: string(),
});

export type ChatUpdate = Infer<typeof ChatUpdate>;
export const ChatUpdate = object({
  id: number(),
  msg: string(),
});

export type Chat = Infer<typeof Chat>;
export const Chat = object({
  id: number(),
  msg: string(),
  room: RoomStruct,
  user: UserStruct,
  links: optional(array(any())),
  children: lazy(() => optional(array(ChatStruct))),
  parent: lazy(() => optional(ChatStruct)),
  createdAt: optional(date()),
  updatedAt: optional(date()),
});

export enum Events {
  create = 'createChat',
  findAll = 'findAllChats',
  update = 'updateChat',
  remove = 'removeChat',
}
