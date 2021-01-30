import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Chat } from './chat.entity';
import { ChatsService } from './chats.service';

@Controller('rooms/:roomId/chat')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chatService: ChatsService) {}

  @Get()
  async findAll(
    @Param('roomId', ParseIntPipe) roomId: number,
  ): Promise<Chat[]> {
    return await this.chatService.findAll({ byRoomId: roomId });
  }
}
