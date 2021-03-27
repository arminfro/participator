import { Struct } from 'superstruct';
import { ChatCreate, ChatUpdate } from './chat';
import { customValidate, ValidationResult } from './utils';

export function validateChatCreate(
  chat: ChatCreate,
): ValidationResult<ChatCreate> {
  return validateChat<ChatCreate>(chat, ChatCreate);
}

export function validateChatUpdate(
  chat: ChatUpdate,
): ValidationResult<ChatUpdate> {
  return validateChat<ChatUpdate>(chat, ChatUpdate);
}

export function validateChat<T>(
  chat: T,
  struct: Struct<T>,
): ValidationResult<T> {
  return customValidate<T>(chat, struct, (failure) => failure);
}
