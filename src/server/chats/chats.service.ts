import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, TreeRepository } from 'typeorm';
import { chatMsgDeleted } from '../../constants';
import { ChatCreate, ChatUpdate } from '../../types/chat';
import { LinksService } from '../links/links.service';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { Chat } from './chat.entity';
import TreeModel from 'tree-model';

const urlRegex =
  /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi;

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
    const urls = chat.msg.match(urlRegex);
    if (urls) {
      // this.linksService.buildLinksForChat(chat.id, urls);
    }
    chat.save();
    return chat;
  }

  async findAll(roomId: number): Promise<Chat[]> {
    const room = await this.findRoom(roomId);

    // findDescendantsTree takes no relations options
    const chats = await this.chatsRepository.findDescendantsTree(
      await this.chatsRepository.findOne({
        where: { id: room.chat.id },
      }),
    );

    const users = (
      await this.usersService.findAll({
        relations: ['chats', 'chats.links', 'joinedRooms', 'ownedRooms'],
      })
    ).filter((user) => user.isPartOfRoom(roomId));

    const tree = new TreeModel().parse<Chat>(chats);
    // kinda hacking user and links relation into chats,
    // cause of missing relations options for findDescendantsTree
    tree.walk(null, (chatNode) => {
      const chatId = chatNode.model.id;
      const user = users.find((user) =>
        user.chats.map((chat) => chat.id).includes(chatId),
      );

      chatNode.model.user = user;
      chatNode.model.links = user.chats.find(
        (chat) => chat.id === chatId,
      ).links;
    });

    return tree.model;
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

  async remove(id: number): Promise<{ id: number } | Chat> {
    const chat = await this.chatsRepository.findOne(id, {
      relations: ['children', 'user', 'links'],
    });
    console.log('chat to remove', chat);
    if (chat.children && chat.children.length > 0) {
      chat.msg = chatMsgDeleted;
      return await chat.save();
    } else {
      await this.chatsRepository.softDelete(id);
      return { id };
    }
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
