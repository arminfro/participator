import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import Chat, { ChatCreate } from '../../types/chat';
import { ChatsService } from './chats.service';

// todo, use JwtAuthGuard
@WebSocketGateway()
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage('createChat')
  async create(
    @MessageBody() chatCreate: ChatCreate,
    @ConnectedSocket() client: Socket,
  ): Promise<Chat> {
    const chat = await this.chatsService.create(chatCreate);
    client.broadcast.emit('newChat', chat);
    return chat;
  }

  // @SubscribeMessage('findAllChats')
  // findAll() {
  //   return this.chatsService.findAll();
  // }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatsService.findOne(id);
  // }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatsService.update(updateChatDto.id, updateChatDto);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatsService.remove(id);
  // }
}
