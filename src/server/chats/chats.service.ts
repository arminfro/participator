import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { ChatCreate, ChatUpdate } from '../../types/chat';
import { LinksService } from '../links/links.service';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { Chat } from './chat.entity';

// todo, regex matches file path
const urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    private readonly linksService: LinksService,
  ) {}

  async create(chatCreate: ChatCreate, roomId: number): Promise<Chat> {
    const chat = await this.build(chatCreate, roomId);
    await getManager().save(chat);
    const linkStrings = chat.msg.match(urlRegex);
    if (linkStrings) {
      const links = await Promise.all(
        linkStrings.map(
          async (url) =>
            await this.linksService.create({ url, chatId: chat.id }),
        ),
      );
      chat.links = links;
    }
    await getManager().save(chat);
    return chat;
  }

  async findAll(roomId: number): Promise<Chat[]> {
    const room = await this.findRoom(roomId);
    return getManager().find(Chat, {
      where: { room },
      relations: ['user', 'links'],
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} chat`;
  // }

  update(chatUpdate: ChatUpdate) {
    this.chatsRepository.update(chatUpdate.id, { msg: chatUpdate.msg });
    this.chatsRepository.update(chatUpdate.id, { msg: chatUpdate.msg });
  }

  remove(id: number) {
    this.chatsRepository.softDelete(id);
  }

  private async build(chatCreate: ChatCreate, roomId: number): Promise<Chat> {
    const chat = new Chat();
    chat.msg = chatCreate.msg;
    chat.room = await this.findRoom(roomId);
    chat.user = await this.findUser(chatCreate.userId);
    return chat;
  }

  // todo, un-DRY
  private async findRoom(roomId: number): Promise<Room> {
    const room = await getManager().findOne(Room, roomId, {
      relations: ['chats'],
    });
    return room;
  }

  // todo, un-DRY
  private async findUser(userId: number): Promise<User> {
    return await getManager().findOne(User, userId);
  }
}
