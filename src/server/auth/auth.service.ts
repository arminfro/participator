import { Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

import { User as UserEntity } from './../users/user.entity';
import { UsersService } from '../users/users.service';
import User from '../../types/user';

export interface AccessToken {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByName(username);
    if (user && user.password && AuthService.comparePassword(password, user)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<AccessToken> {
    const payload = { username: user.name, userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  verify(token: string, verifyOptions?: JwtVerifyOptions): any {
    return this.jwtService.verify(token, verifyOptions);
  }

  static hashPassword(password: string): string {
    return hashSync(password, genSaltSync(10));
  }

  static comparePassword(password: string, user: UserEntity): boolean {
    return compareSync(password, user.password);
  }
}
