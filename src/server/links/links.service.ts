import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import LinkPreviewGenerator = require('link-preview-generator');
import { IncomingMessage } from 'http';
import request = require('request');

import { LinkCreate } from '../../types/link';
import { Chat } from '../chats/chat.entity';
import { Link } from './link.entity';

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
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  async create(linkCreate: LinkCreate): Promise<Link | undefined> {
    const link = await this.build(linkCreate);
    if (link) {
      return await this.linksRepository.save(link);
    }
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

  async buildLinksForChat(chatId: number, rawLinks: string[]): Promise<Link[]> {
    const links = await Promise.all(
      rawLinks.map(async (url) => {
        const urlWithProtocol = await this.setHttpPrefix(url);
        if (urlWithProtocol) {
          return await this.create({
            url: urlWithProtocol,
            chatId,
          });
        }
      }),
    );
    return links.filter((a) => a);
  }

  private async build(linkCreate: LinkCreate): Promise<Link | undefined> {
    const previewData = await this.getPreview(linkCreate.url);
    if (previewData) {
      const link = new Link();
      link.url = linkCreate.url;
      link.title = previewData.title;
      link.description = previewData.description;
      link.domain = previewData.domain;
      link.imgUrl = previewData.img;
      link.chat = await this.findChat(linkCreate.chatId);
      return link;
    }
  }

  private async findChat(chatId: number): Promise<Chat> {
    return await getManager().findOne(Chat, chatId);
  }

  private async getPreview(url: string): Promise<PreviewData> {
    return await LinkPreviewGenerator(url).catch((e: Error) => {
      if (/^net::ERR_ABORTED/.test(e.message)) {
        this.logger.warn(e.message, 'LinksService');
      } else {
        this.logger.error(
          `handled error: ${e.message} for ${url}`,
          e.stack,
          'LinksService',
        );
      }
    });
  }

  private async setHttpPrefix(url: string): Promise<string> {
    if (url.search(/^http[s]?:\/\//) == -1) {
      if (await this.urlExists(`https://${url}`)) {
        return `https://${url}`;
      } else if (await this.urlExists(`http://${url}`)) {
        return `http://${url}`;
      }
    } else {
      return url;
    }
  }

  private async urlExists(url: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) =>
      request(url, { method: 'HEAD' }, (err: Error, res: IncomingMessage) => {
        if (err || /4\d\d/.test(String(res.statusCode))) {
          reject(false);
        } else {
          resolve(true);
        }
      }),
    ).catch(() => Promise.resolve(false));
  }
}
