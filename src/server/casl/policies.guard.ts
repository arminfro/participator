import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getManager } from 'typeorm';
import { AppAbility } from '../../casl/ability';
import { Room } from '../rooms/room.entity';
import { User } from '../users/user.entity';
import { CaslAbilityFactory } from './casl-ability.factory';

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type RequestedSubjects = {
  user?: User;
  room?: Room;
};

type PolicyHandlerCallback = (
  ability: AppAbility,
  subject: RequestedSubjects,
) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const req = context.switchToHttp().getRequest();
    const { user } = req;

    if (user) {
      const requestedSubjects = {
        user: await this.getRequestedUser(req.url),
        room: await this.getRequestedRoom(req.url),
      };

      const ability = this.caslAbilityFactory.createForUser(user);
      const allowed = policyHandlers.every((handler) =>
        this.execPolicyHandler(handler, ability, requestedSubjects),
      );
      return allowed;
    } else {
      return false;
    }
  }

  private async getRequestedUser(url: string): Promise<User | undefined> {
    const requestedUserId = url.match(/(?<=users\/)\d+/);
    if (requestedUserId) {
      return await getManager().findOne(User, +requestedUserId);
    }
  }

  private async getRequestedRoom(url: string): Promise<Room | undefined> {
    const requestedRoomId = url.match(/(?<=rooms\/)\d+/);
    if (requestedRoomId) {
      return await getManager().findOne(Room, +requestedRoomId, {
        relations: ['admin', 'members'],
      });
    }
  }

  // todo, doesn't work to call with:
  // const requestedSubjects = {
  //   user: await this.getRequestedEntity('users', req.url, User),
  //   room: await this.getRequestedEntity('rooms', req.url, Room),
  // } as RequestedSubjects;
  //
  // private async getRequestedEntity(
  //   pathName: string,
  //   name: string,
  //   entity: any,
  // ): Promise<User | Room | undefined> {
  //   const regex = new RegExp('/(?<=' + pathName + '/)d+/');
  //   const requestedEntityId = pathName.match(regex);
  //   if (requestedEntityId) {
  //     console.log('requestedEntityId', requestedEntityId);
  //     return await getManager().findOne(entity, +requestedEntityId);
  //   }
  // }

  private execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
    subject: RequestedSubjects,
  ) {
    if (typeof handler === 'function') {
      return handler(ability, subject);
    }
    return handler.handle(ability);
  }
}

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
