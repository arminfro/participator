import { Chat } from './chat';
import { User } from './user';

export interface LinkCreate {
  url: string;
  chatId: number;
}

export interface LinkUpdate {
  id: number;
  user: User;
}

export default interface Link {
  id: number;
  title: string;
  description?: string;
  domain: string;
  imgUrl?: string;
  url: string;
  readonly chat: Chat;
  createdAt: Date;
  updatedAt: Date;
}
