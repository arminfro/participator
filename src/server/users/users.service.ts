import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate, ValidationError } from 'class-validator';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import {
  UserCreate,
  UserUpdate,
  validateUserCreate,
  ValidationErrors,
} from '../../types/user';
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
    this.validateUser(user, validateUserCreate(userCreate));
    return await this.usersRepository.save(user);
  }

  async update(
    id: number,
    userUpdate: UserUpdate,
  ): Promise<UpdateResult | never> {
    const user = await this.findOne(id);
    console.log('before', user);

    if (userUpdate.name) user.name = userUpdate.name;
    if (userUpdate.hasHandUp) user.hasHandUp = userUpdate.hasHandUp;
    if (userUpdate.randomGroup) user.randomGroup = userUpdate.randomGroup;
    if (userUpdate.active) user.active = userUpdate.active;
    return await this.usersRepository.update(id, user);
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
    errorsFromDto: ValidationErrors,
  ): Promise<void | never> {
    const validationErrors = user ? await validate(user) : [];
    const errorsClassValidator = validationErrors.map((err: ValidationError) =>
      err.toString(),
    );

    const errors = [...errorsFromDto, ...errorsClassValidator];
    console.debug('user create', user, errors.join('. '));

    if (errors.length > 0 || !user) {
      throw new HttpException(errors.join('. '), HttpStatus.BAD_REQUEST);
    }
  }

  private async build(userCreate: UserCreate): Promise<User | undefined> {
    const user = new User();
    if (user) {
      user.name = userCreate.name;
      user.password = AuthService.hashPassword(userCreate.pw1);
      return user;
    } else {
      console.error('Error in build', userCreate);
    }
  }
}
