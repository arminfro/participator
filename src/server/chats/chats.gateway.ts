import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { Socket } from 'socket.io';
import Chat, { ChatCreate, ChatUpdate, Events } from '../../types/chat';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { ChatsService } from './chats.service';

@WebSocketGateway({ namespace: /^\/rooms\/\d\/chat$/ })
export class ChatsGateway implements NestGateway {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

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
    @MessageBody() chatCreate: ChatCreate,
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
  remove(
    @MessageBody() idObj: { id: number },
    @ConnectedSocket() client: Socket,
  ): { id: number } {
    this.chatsService.remove(idObj.id);
    client.broadcast.emit(Events.remove, idObj);
    client.emit(Events.remove, idObj);
    return idObj;
  }

  // todo, un-DRY
  private roomIdByNsp(nsp: string): number {
    return +nsp.split('/')[2];
  }
}
