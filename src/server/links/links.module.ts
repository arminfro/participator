import { Logger, Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { Link } from './link.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [LinksService, Logger],
  imports: [TypeOrmModule.forFeature([Link])],
  exports: [LinksService],
})
export class LinksModule {}
