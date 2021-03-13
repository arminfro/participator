import { Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

import { UsersService } from '../users/users.service';
import { User } from '../../types/user';
import { JwtPayload } from './jwt.strategy';

export interface AccessToken {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEMail(email);
    if (user && user.password && AuthService.comparePassword(password, user)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<AccessToken> {
    const payload = { email: user.name, userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  verify(token: string, verifyOptions?: JwtVerifyOptions): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token, verifyOptions);
  }

  static hashPassword(password: string): string {
    return hashSync(password, genSaltSync(10));
  }

  static comparePassword(password: string, user: User): boolean {
    return compareSync(password, user.password);
  }
}
