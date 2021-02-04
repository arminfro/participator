import { Injectable } from '@nestjs/common';
import { LinkCreate, LinkUpdate } from '../../types/link';
import * as LinkPreviewGenerator from 'link-preview-generator';
import { Link } from './link.entity';
import { Room } from '../rooms/room.entity';
import { getManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../chats/chat.entity';

interface PreviewData {
  title: string;
  description: string;
  domain: string;
  img: string;
}

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link) private linksRepository: Repository<Link>,
  ) {}

  async create(linkCreate: LinkCreate): Promise<Link> {
    const link = await this.build(linkCreate);
    await getManager().save(link);
    return link;
  }

  async findAll(roomId: number): Promise<Link[]> {
    const room = await this.findRoom(roomId);
    return getManager().find(Link, {
      where: { chat: { room } },
      relations: ['chat', 'room'],
    });
  }

  // findOne(id: number) {
  // return `This action returns a #${id} link`;
  // }

  // update(id: number, linkUpdate: LinkUpdate) {
  //   return `This action updates a #${id} link`;
  // }

  remove(id: number) {
    this.linksRepository.softDelete(id);
  }

  private async build(linkCreate: LinkCreate): Promise<Link> {
    const link = new Link();
    const previewData = await this.getPreview(linkCreate.url);
    link.title = previewData.title;
    link.description = previewData.description;
    link.domain = previewData.domain;
    link.imgUrl = previewData.img;
    link.chat = await this.findChat(linkCreate.chatId);
    return link;
  }

  // todo, un-DRY
  private async findRoom(roomId: number): Promise<Room> {
    const room = await getManager().findOne(Room, roomId, {
      relations: ['chats'],
    });
    return room;
  }

  private async findChat(chatId: number): Promise<Chat> {
    return await getManager().findOne(Chat, chatId);
  }

  private async getPreview(url: string): Promise<PreviewData> {
    return await LinkPreviewGenerator(url);
  }
}
