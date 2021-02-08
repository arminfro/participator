import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import User from '../../types/user';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './constants';

type Payload = { username: string; userId: number; iat: number; exp: number };

@Injectable()
export class WebsocketJwtStrategy extends PassportStrategy(
  Strategy,
  'websocket-jwt',
) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: WebsocketJwtStrategy.getToken,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  static getToken(req) {
    return req.headers.authorization;
  }

  // getRequest(context) {
  //   console.log(
  //     'getRequest in Strategy',
  //     context.switchToWs().getClient().handshake,
  //   );
  //   return context.switchToWs().getClient().handshake;
  // }

  async validate(payload: Payload): Promise<User> {
    const user = await this.usersService.findOne(payload.userId);
    console.log('validated user', user);
    return user;
  }
}
