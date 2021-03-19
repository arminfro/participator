import { BadGatewayException, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ChatCreate, ChatUpdate } from '../../types/chat';
import {
  validateChatCreate,
  validateChatUpdate,
} from '../../types/chat.validation';

@Injectable()
export class ChatUpdatePipe implements PipeTransform<ChatUpdate, ChatUpdate> {
  transform(chat: ChatUpdate): ChatUpdate {
    const [failures, validatedChatUpdate] = validateChatUpdate(chat);
    if (!validatedChatUpdate) {
      throw new WsException(
        `Validation ChatUpdate payload failed\n${failures
          .map((failure) => failure.message)
          .join('\n')}`,
      );
    }
    return validatedChatUpdate;
  }
}

@Injectable()
export class ChatCreatePipe implements PipeTransform<ChatCreate, ChatCreate> {
  transform(chat: ChatCreate): ChatCreate {
    const [failures, validatedChatCreate] = validateChatCreate(chat);
    if (!validatedChatCreate) {
      throw new WsException(
        `Validation ChatCreate payload failed\n${failures
          .map((failure) => failure.message)
          .join('\n')}`,
      );
    }
    return validatedChatCreate;
  }
}
