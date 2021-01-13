import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { User as UserEntity } from './../users/user.entity';
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

  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  static comparePassword(password: string, user: UserEntity): boolean {
    return bcrypt.compareSync(password, user.password);
  }
}
