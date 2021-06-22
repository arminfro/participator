import { forwardRef, Logger, Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { Link } from './link.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModule } from '../chats/chats.module';

@Module({
  providers: [LinksService, Logger],
  imports: [forwardRef(() => ChatsModule), TypeOrmModule.forFeature([Link])],
  exports: [LinksService],
})
export class LinksModule {}
