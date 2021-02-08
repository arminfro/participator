import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { Socket } from 'socket.io';
import Chat, { ChatCreate, ChatUpdate, Events } from '../../types/chat';
import { WebsocketJwtAuthGuard } from '../auth/websocket-jwt-auth.guard';
import { ChatsService } from './chats.service';

@WebSocketGateway({ namespace: /^\/rooms\/\d\/chat$/ })
@UseGuards(WebsocketJwtAuthGuard)
export class ChatsGateway implements NestGateway {
  constructor(private readonly chatsService: ChatsService) {}

  handleConnection(socket: Socket) {
    const { user } = socket.client.request;
    // user is not there. WebsocketJwtAuthGuard#canActivate gets called after handleConnection ??
    console.log('user in handleConnection', user);
  }

  @SubscribeMessage(Events.create)
  async create(
    @MessageBody() chatCreate: ChatCreate,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const roomId = this.roomIdByNsp(client.nsp.name);
    const chat = await this.chatsService.create(chatCreate, roomId);
    client.broadcast.emit(Events.create, chat);
    client.emit(Events.create, chat);
  }

  @SubscribeMessage(Events.findAll)
  async findAll(@ConnectedSocket() client: Socket): Promise<Chat[]> {
    // user is there
    console.log('user in handleConnection', client.client.request.user);
    return await this.chatsService.findAll(this.roomIdByNsp(client.nsp.name));
  }

  @SubscribeMessage('findOneChat')
  async findOne(@MessageBody() id: number): Promise<Chat> {
    return await this.chatsService.findOne(id);
  }

  @SubscribeMessage(Events.update)
  async update(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatUpdate: ChatUpdate,
  ): Promise<Chat> {
    await this.chatsService.update(chatUpdate);
    const chat = await this.chatsService.findOne(chatUpdate.id);
    client.broadcast.emit(Events.update, chat);
    client.emit(Events.update, chat);
    return chat;
  }

  @SubscribeMessage(Events.remove)
  remove(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    client.broadcast.emit(Events.remove, id);
    client.emit(Events.remove, id);
    return this.chatsService.remove(id);
  }

  // todo, un-DRY
  private roomIdByNsp(nsp: string): number {
    return +nsp.split('/')[2];
  }
}
