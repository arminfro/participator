import {
  any,
  array,
  date,
  Describe,
  Infer,
  number,
  object,
  optional,
  string,
} from 'superstruct';
import Link from './link';
import { Room } from './room';
import { User } from './user';
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

export type Chat = {
  readonly id: number;
  msg: string;
  readonly room?: Room;
  readonly user?: User;
  readonly links?: Link[];
  readonly children?: Chat[];
  readonly parent?: Chat;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};
export const Chat: Describe<Chat> = object({
  id: number(),
  msg: string(),
  room: optional(any()),
  user: optional(any()),
  links: optional(array(any())),
  children: optional(array(any())),
  parent: optional(any()),
  createdAt: optional(date()),
  updatedAt: optional(date()),
});

export enum Events {
  create = 'createChat',
  findAll = 'findAllChats',
  update = 'updateChat',
  remove = 'removeChat',
}
