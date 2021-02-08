import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import {Socket} from 'socket.io';
import Chat, {ChatCreate, ChatUpdate, Events} from '../../types/chat';
import {ChatsService} from './chats.service';

// todo, use JwtAuthGuard
@WebSocketGateway({namespace: /^\/rooms\/\d\/chat$/})
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}

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
    return await this.chatsService.update(chatUpdate);
  }

  @SubscribeMessage(Events.remove)
  remove(@MessageBody() id: number) {
    return this.chatsService.remove(id);
  }

  // todo, un-DRY
  private roomIdByNsp(nsp: string): number {
    return +nsp.split('/')[2];
  }
}
