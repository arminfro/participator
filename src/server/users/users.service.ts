import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Failure } from 'superstruct';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';

import { UserCreate, UserUpdate } from '../../types/user';
import { validateUserCreate } from '../../types/user.validation';
import { AuthService } from '../auth/auth.service';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll(opts?: FindManyOptions<User>): Promise<User[]> {
    return await this.usersRepository.find(opts);
  }

  async findOne(
    id: number,
    opts?: FindOneOptions<User>,
  ): Promise<User | undefined> {
    return await this.usersRepository.findOne(id, opts);
  }

  async create(userCreate: UserCreate): Promise<User | never> {
    const user = await this.build(userCreate);
    this.validateUser(user, validateUserCreate(userCreate)[0] || []);
    return await this.usersRepository.save(user);
  }

  async update(id: number, userUpdate: UserUpdate): Promise<User> {
    const user = await this.findOne(id);

    if (userUpdate.name) user.name = userUpdate.name;
    if (userUpdate.hasHandUp !== undefined)
      user.hasHandUp = userUpdate.hasHandUp;
    if (userUpdate.randomGroup !== undefined)
      user.randomGroup = userUpdate.randomGroup;
    if (userUpdate.active !== undefined) user.active = userUpdate.active;
    return await user.save();
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findByName(name: string): Promise<User> {
    return await this.usersRepository.findOne({ name });
  }

  private async validateUser(
    user: User,
    failures: Failure[],
  ): Promise<void | never> {
    const validationErrors = user ? await validate(user) : [];

    const errors = [
      ...failures.map((failure) => failure.message),
      ...validationErrors.map((err) => err.toString(false)),
    ];
    console.debug('user create', user, errors.join('. '));

    if (errors.length > 0 || !user) {
      throw new HttpException(errors.join('. '), HttpStatus.BAD_REQUEST);
    }
  }

  private async build(userCreate: UserCreate): Promise<User | undefined> {
    const user = new User();
    if (user) {
      user.name = userCreate.name;
      user.password = AuthService.hashPassword(userCreate.pws.pw1);
      return user;
    } else {
      console.error('Error in build', userCreate);
    }
  }
}
