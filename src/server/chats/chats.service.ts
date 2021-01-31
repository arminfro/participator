import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { ChatCreate } from '../../types/chat';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { Chat } from './chat.entity';

@Injectable()
export class ChatsService {
  // constructor() {} // @InjectRepository(Chat) private chatsRepository: Repository<Chat>,

  async create(chatCreate: ChatCreate): Promise<Chat> {
    const chat = await this.build(chatCreate);
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

  // update(id: number, updateChatDto: UpdateChatDto) {
  //   return `This action updates a #${id} chat`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} chat`;
  // }

  private async build(chatCreate: ChatCreate): Promise<Chat> {
    const chat = new Chat();
    chat.msg = chatCreate.msg;
    chat.room = await this.findRoom(chatCreate.roomId);
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
