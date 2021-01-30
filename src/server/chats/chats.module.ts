import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { Chat } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsController } from './chats.controller';

@Module({
  providers: [ChatsGateway, ChatsService],
  controllers: [ChatsController],
  imports: [TypeOrmModule.forFeature([Chat])],
  exports: [ChatsService],
})
export class ChatsModule {}
