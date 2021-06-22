import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IncomingMessage } from 'http';
import { Repository } from 'typeorm';
import { Events } from '../../types/chat';
import { LinkCreate } from '../../types/link';
import { ChatsGateway } from '../chats/chats.gateway';
import { ChatsService } from '../chats/chats.service';
import { Link } from './link.entity';
import LinkPreviewGenerator = require('link-preview-generator');
import request = require('request');

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
    @Inject(ChatsGateway) private readonly chatsGateway: ChatsGateway,
    @Inject(forwardRef(() => ChatsService))
    private readonly chatsService: ChatsService,
  ) {}

  async create(linkCreate: LinkCreate): Promise<Link | undefined> {
    const link = await this.build(linkCreate);
    if (link) {
      return await link.save();
    }
  }

  async findAll(): Promise<Link[]> {
    return await this.linksRepository.find({
      relations: ['chat'],
    });
  }

  async findOne(id: number): Promise<Link | undefined> {
    return await this.linksRepository.findOne(id);
  }

  // update(id: number, linkUpdate: LinkUpdate) {
  //   return `This action updates a #${id} link`;
  // }

  remove(id: number) {
    this.linksRepository.delete(id);
  }

  async dispatchBuildLinksForChat(
    chatId: number,
    rawLinks: string[],
  ): Promise<Link[]> {
    const preSavedLinks = await Promise.all(
      rawLinks.map(async () => {
        const link = new Link();
        await link.save();
        return link;
      }),
    );
    this.buildLinksForChat(chatId, rawLinks, preSavedLinks);
    return preSavedLinks;
  }

  private async buildLinksForChat(
    chatId: number,
    rawLinks: string[],
    preSavedLinks: Link[],
  ): Promise<Link[]> {
    const links = await Promise.all(
      rawLinks.map(async (url, index) => {
        const urlWithProtocol = await this.setHttpPrefix(url);
        if (urlWithProtocol) {
          return await this.updatePreSaved(
            {
              url: urlWithProtocol,
              chatId,
            },
            preSavedLinks[index],
          );
        } else {
          const link = preSavedLinks[index];
          this.remove(link.id);
        }
      }),
    );
    return links.filter((a) => a);
  }

  private async updatePreSaved(
    linkCreate: LinkCreate,
    preSavedLink: Link,
  ): Promise<Link> {
    const previewData = await this.getPreview(linkCreate.url);
    if (previewData) {
      preSavedLink.url = linkCreate.url;
      preSavedLink.title = previewData.title;
      preSavedLink.description = previewData.description;
      preSavedLink.domain = previewData.domain;
      preSavedLink.imgUrl = previewData.img;
      preSavedLink.chat = await this.chatsService.findOne(linkCreate.chatId);
      preSavedLink.save();
      this.updateChat(preSavedLink);
      return preSavedLink;
    } else {
      preSavedLink.remove();
    }
  }

  private updateChat(preSavedLink: Link): void {
    const chat = preSavedLink.chat;
    const newChat = {
      ...chat,
      links: chat.links.map((currentLink) =>
        currentLink.id === preSavedLink.id ? preSavedLink : currentLink,
      ),
    };
    this.chatsGateway.server.emit(Events.update, newChat);
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
      link.chat = await this.chatsService.findOne(linkCreate.chatId);
      return link;
    }
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
