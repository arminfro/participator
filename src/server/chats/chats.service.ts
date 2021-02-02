import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { ChatCreate, ChatUpdate } from '../../types/chat';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { Chat } from './chat.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
  ) {}

  async create(chatCreate: ChatCreate, roomId: number): Promise<Chat> {
    const chat = await this.build(chatCreate, roomId);
    await getManager().save(chat);
    return chat;
  }

  async findAll(roomId: number): Promise<Chat[]> {
    const room = await this.findRoom(roomId);
    return getManager().find(Chat, { where: { room }, relations: ['user'] });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} chat`;
  // }

  update(chatUpdate: ChatUpdate) {
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
