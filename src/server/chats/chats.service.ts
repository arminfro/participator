import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { ChatCreate } from '../../types/chat';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { Chat } from './chat.entity';
// import { CreateChatDto } from './dto/create-chat.dto';
// import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
  // constructor() {} // @InjectRepository(Chat) private chatsRepository: Repository<Chat>,

  async create(chatCreate: ChatCreate): Promise<Chat> {
    const chat = await this.build(chatCreate);
    await getManager().save(chat);
    return chat;
  }

  async findAll(opts: { byRoomId: number }): Promise<Chat[]> {
    const room = await this.findRoom(opts.byRoomId);
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

  private async findUser(userId: number): Promise<User> {
    return await getManager().findOne(User, userId);
  }
}
