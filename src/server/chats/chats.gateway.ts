import { forwardRef, Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { Server, Socket } from 'socket.io';
import { Chat, ChatCreate, ChatUpdate, Events } from '../../types/chat';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { ChatCreatePipe, ChatUpdatePipe } from './chat.pipes';
import { ChatsService } from './chats.service';

@WebSocketGateway({ namespace: /^\/rooms\/\d\/chat$/ })
export class ChatsGateway implements NestGateway, OnGatewayConnection {
  constructor(
    @Inject(forwardRef(() => ChatsService))
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const payload = this.authService.verify(
      client.handshake.headers.authorization,
    );
    const user = await this.usersService.findOne(payload.userId, {
      relations: ['joinedRooms', 'ownedRooms'],
    });
    const roomId = this.roomIdByNsp(client.nsp.name);
    if (!user || !user.isPartOfRoom(roomId)) {
      console.log('ws disconnect');
      client.disconnect();
    }
  }

  @SubscribeMessage(Events.create)
  async create(
    @MessageBody(new ChatCreatePipe()) chatCreate: ChatCreate,
    @ConnectedSocket() client: Socket,
  ): Promise<Chat> {
    const roomId = this.roomIdByNsp(client.nsp.name);
    const chat = await this.chatsService.create(chatCreate, roomId);
    client.broadcast.emit(Events.create, chat);
    client.emit(Events.create, chat);
    return chat;
  }

  @SubscribeMessage(Events.findAll)
  async findAll(@ConnectedSocket() client: Socket): Promise<Chat[]> {
    return await this.chatsService.findAll(this.roomIdByNsp(client.nsp.name));
  }

  // @SubscribeMessage('findOneChat')
  // async findOne(@MessageBody() id: number): Promise<Chat> {
  //   return await this.chatsService.findOne(id);
  // }

  @SubscribeMessage(Events.update)
  async update(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ChatUpdatePipe()) chatUpdate: ChatUpdate,
  ): Promise<Chat> {
    await this.chatsService.update(chatUpdate);
    const chat = await this.chatsService.findOne(chatUpdate.id);
    client.broadcast.emit(Events.update, chat);
    client.emit(Events.update, chat);
    return chat;
  }

  @SubscribeMessage(Events.remove)
  async remove(
    @MessageBody() idObj: { id: number },
    @ConnectedSocket() client: Socket,
  ): Promise<{ id: number } | Chat> {
    const removeResult = await this.chatsService.remove(idObj.id);
    client.broadcast.emit(Events.remove, removeResult);
    client.emit(Events.remove, removeResult);
    return removeResult;
  }

  // todo, un-DRY
  private roomIdByNsp(nsp: string): number {
    return +nsp.split('/')[2];
  }
}
