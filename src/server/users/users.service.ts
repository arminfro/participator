import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, UpdateResult, DeleteResult } from 'typeorm';
import { validate, ValidationError } from 'class-validator';

import { User } from './user.entity';
import { UserCreate, validateUserCreate } from '../../types/user';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | undefined> {
    return await this.usersRepository.findOne(id);
  }

  async create(userCreate: UserCreate): Promise<User | never> {
    const errs1 = validateUserCreate(userCreate);
    userCreate.pw1 = AuthService.hashPassword(userCreate.pw1);
    const user = await this.build(userCreate);

    const validationErrors = user ? await validate(user) : [];
    const errs2 = validationErrors.map((err: ValidationError) =>
      err.toString(),
    );

    const errors = [...errs1, ...errs2];

    console.log(user, errors.join('. '));
    if (errors.length > 0 || !user) {
      throw new HttpException(errors.join('. '), HttpStatus.BAD_REQUEST);
    }
    await getManager().save(user);
    // return [user, errors]
    return user;
  }

  async update(id: number, user: User): Promise<UpdateResult> {
    const validationErrors = await validate(user);
    const errs2 = validationErrors.map((err: ValidationError) =>
      err.toString(),
    );

    const errors = [...errs2];

    if (errors.length > 0) {
      throw new HttpException(errors.join('. '), HttpStatus.BAD_REQUEST);
    }
    return await this.usersRepository.update(id, user);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findByName(name: string): Promise<User> {
    const users = await this.usersRepository.find({ name });
    return users[0];
  }

  async build(userCreate: UserCreate): Promise<User | undefined> {
    const user = new User();
    if (user) {
      user.name = userCreate.name;
      user.password = userCreate.pw1;
      return user;
    } else {
      console.error('Error in build', userCreate);
    }
  }
}
