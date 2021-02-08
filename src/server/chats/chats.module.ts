import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { Chat } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksModule } from '../links/links.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [ChatsGateway, ChatsService],
  imports: [
    TypeOrmModule.forFeature([Chat]),
    UsersModule,
    LinksModule,
    AuthModule,
  ],
  exports: [ChatsService],
})
export class ChatsModule {}
