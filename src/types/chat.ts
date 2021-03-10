import {
  any,
  array,
  Describe,
  Infer,
  is,
  number,
  object,
  optional,
  string,
  validate,
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
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly deletedAt?: Date;
};
export const Chat: Describe<Chat> = object({
  id: number(),
  msg: string(),
  room: optional(any()),
  user: optional(any()),
  links: optional(array(any())),
  children: optional(array(any())),
  parent: optional(any()),
  createdAt: any(),
  updatedAt: any(),
  deletedAt: any(),
});

export enum Events {
  create = 'createChat',
  findAll = 'findAllChats',
  update = 'updateChat',
  remove = 'removeChat',
}

export function isChat(chat: any): chat is Chat {
  if (is(chat, Chat)) {
    return true;
  } else {
    console.debug("isn't a Chat:", validate(chat, Chat));
    return false;
  }
}
