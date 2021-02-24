import { Injectable } from '@nestjs/common';
import { LinkCreate } from '../../types/link';
import * as LinkPreviewGenerator from 'link-preview-generator';
import { Link } from './link.entity';
import { Room } from '../rooms/room.entity';
import { getManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../chats/chat.entity';
import { User } from '../users/user.entity';

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
    return await this.linksRepository.save(link);
  }

  async findAll(): Promise<Link[]> {
    return await this.linksRepository.find({
      relations: ['chat'],
    });
  }

  async findOne(id: number): Promise<Link> {
    return await this.linksRepository.findOne(id);
  }

  // update(id: number, linkUpdate: LinkUpdate) {
  //   return `This action updates a #${id} link`;
  // }

  remove(id: number) {
    this.linksRepository.softDelete(id);
  }

  private async build(linkCreate: LinkCreate): Promise<Link> {
    const link = new Link();
    const previewData = await this.getPreview(linkCreate.url);
    link.url = linkCreate.url;
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
      relations: ['chat'],
    });
    return room;
  }

  private async findUser(userId: number): Promise<User> {
    return await getManager().findOne(User, userId);
  }

  private async findChat(chatId: number): Promise<Chat> {
    return await getManager().findOne(Chat, chatId);
  }

  private async getPreview(url: string): Promise<PreviewData> {
    return await LinkPreviewGenerator(url);
  }
}
