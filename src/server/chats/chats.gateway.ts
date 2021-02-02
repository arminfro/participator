import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import Chat, { ChatCreate, ChatUpdate, Events } from '../../types/chat';
import { ChatsService } from './chats.service';

// todo, use JwtAuthGuard
@WebSocketGateway({ namespace: /^\/rooms\/\d\/chat$/ })
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}

  @SubscribeMessage(Events.createChat)
  async create(
    @MessageBody() chatCreate: ChatCreate,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const chat = await this.chatsService.create(
      chatCreate,
      this.roomIdByNsp(client.nsp.name),
    );
    client.broadcast.emit(Events.createChat, chat);
  }

  @SubscribeMessage(Events.findAllChats)
  async findAll(@ConnectedSocket() client: Socket): Promise<Chat[]> {
    return await this.chatsService.findAll(this.roomIdByNsp(client.nsp.name));
  }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatsService.findOne(id);
  // }

  @SubscribeMessage(Events.updateChat)
  update(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatUpdate: ChatUpdate,
  ) {
    return this.chatsService.update(chatUpdate);
  }

  @SubscribeMessage(Events.removeChat)
  remove(@MessageBody() id: number) {
    return this.chatsService.remove(id);
  }

  private roomIdByNsp(nsp: string): number {
    return +nsp.split('/')[2];
  }
}
