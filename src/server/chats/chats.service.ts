import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getManager, TreeRepository } from 'typeorm';
import { IncomingMessage } from 'http';
import * as request from 'request';

import { ChatCreate, ChatUpdate } from '../../types/chat';
import { mergeObjsById } from '../../utils/transform-tree';
import { LinksService } from '../links/links.service';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { Chat } from './chat.entity';

// todo, regex matches file path
const urlRegex = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi;

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatsRepository: TreeRepository<Chat>,
    private readonly linksService: LinksService,
    private readonly usersService: UsersService,
  ) {}

  async create(chatCreate: ChatCreate, roomId: number): Promise<Chat> {
    const chat = await this.build(chatCreate, roomId);
    await this.chatsRepository.save(chat);
    const linkStrings = chat.msg.match(urlRegex);
    if (linkStrings) {
      const links = await Promise.all(
        linkStrings
          .map(async (url) => {
            const urlWithProtocol = await this.setHttpPrefix(url);
            if (urlWithProtocol) {
              return await this.linksService.create({
                url: urlWithProtocol,
                chatId: chat.id,
              });
            }
          })
          .filter((a) => a),
      );
      chat.links = links;
    }
    await this.chatsRepository.save(chat);
    return chat;
  }

  async findAll(roomId: number): Promise<Chat[]> {
    const room = await this.findRoom(roomId);

    // findDescendantsTree takes no options
    let chats = await this.chatsRepository.findDescendantsTree(
      await this.chatsRepository.findOne({
        where: { id: room.chat.id },
      }),
    );

    const users = await this.usersService.findAll({
      relations: ['chats', 'joinedRooms', 'ownedRooms'],
    });

    users
      // kinda hacking user relation into chats, cause of missing relations options
      .filter((user) => user.isPartOfRoom(roomId))
      .map((user) => ({ user, chats: user.chats.map((chat) => chat.id) }))
      .forEach((userMap: { user: User; chats: number[] }) => {
        userMap.chats.forEach((chatId) => {
          chats = mergeObjsById<Chat>(chats, chatId, 'user', userMap.user);
        });
      });

    return chats.children;
  }

  async findOne(id: number): Promise<Chat> {
    return await this.chatsRepository.findOne(id, {
      relations: ['user', 'links'],
    });
  }

  async update(chatUpdate: ChatUpdate): Promise<Chat> {
    await this.chatsRepository.update(chatUpdate.id, { msg: chatUpdate.msg });
    return await this.findOne(chatUpdate.id);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.chatsRepository.delete(id);
  }

  private async build(chatCreate: ChatCreate, roomId: number): Promise<Chat> {
    const chat = new Chat();
    chat.msg = chatCreate.msg;
    chat.user = await this.findUser(chatCreate.userId);
    if (chatCreate.parentId) {
      chat.parent = await this.chatsRepository.findOne(chatCreate.parentId);
    } else {
      // no parent is only possible on room create
      chat.room = await this.findRoom(roomId);
    }
    return chat;
  }

  private async setHttpPrefix(url: string): Promise<string> {
    if (url.search(/^http[s]?:\/\//) == -1) {
      if (await this.urlExists(`https://${url}`)) {
        return `https://${url}`;
      } else if (await this.urlExists(`http://${url}`)) {
        return `http://${url}`;
      }
    } else {
      return url;
    }
  }

  private async urlExists(url: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) =>
      request(url, { method: 'HEAD' }, (err: Error, res: IncomingMessage) => {
        if (err || /4\d\d/.test(String(res.statusCode))) {
          reject(false);
        } else {
          resolve(true);
        }
      }),
    ).catch(() => Promise.resolve(false));
  }

  // todo, un-DRY
  private async findRoom(roomId: number): Promise<Room> {
    const room = await getManager().findOne(Room, roomId, {
      relations: ['chat'],
    });
    return room;
  }

  // todo, un-DRY
  private async findUser(userId: number): Promise<User> {
    return await getManager().findOne(User, userId);
  }
}
