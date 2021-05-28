import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Action } from '../../casl/action';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsePolicy } from '../casl/use-policy.decorator';
import { ChatsService } from './chats.service';

@Controller('api/rooms/:roomId/chat')
@UseGuards(JwtAuthGuard)
export class ChatsApiController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @UsePolicy((ability, subjects) => ability.can(Action.Read, subjects.room))
  findAll(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.chatsService.findAll(roomId);
  }
}
