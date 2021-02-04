import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { Chat } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksModule } from '../links/links.module';
import { Link } from '../links/link.entity';

@Module({
  providers: [ChatsGateway, ChatsService],
  imports: [TypeOrmModule.forFeature([Chat]), LinksModule],
  exports: [ChatsService],
})
export class ChatsModule {}
