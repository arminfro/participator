import { StorageService } from '@codebrew/nestjs-storage';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { Failure } from 'superstruct';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { UserCreate, UserUpdate } from '../../types/user';
import { validateUserCreate } from '../../types/user.validation';
import { AuthService } from '../auth/auth.service';
import { MailerService } from '../mailer/mailer.service';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private storage: StorageService,
    private readonly mailerService: MailerService,
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
    const builtUser = await this.build(userCreate);
    this.validateUser(builtUser, validateUserCreate(userCreate)[0] || []);
    const user = await this.usersRepository.save(builtUser);
    if (user) {
      this.mailerService.sendWelcome({ name: user.name, email: user.email });
    }
    return user;
  }

  async update(id: number, userUpdate: UserUpdate): Promise<User> {
    const user = await this.findOne(id);

    if (userUpdate.name) user.name = userUpdate.name;
    if (userUpdate.hasHandUp !== undefined)
      user.hasHandUp = userUpdate.hasHandUp;
    if (userUpdate.avatarUrl !== undefined)
      user.avatarUrl = userUpdate.avatarUrl;
    if (userUpdate.randomGroup !== undefined)
      user.randomGroup = userUpdate.randomGroup;
    if (userUpdate.active !== undefined) user.active = userUpdate.active;
    user.save();
    return user;
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async storeAvatar(file: Express.Multer.File, user: User): Promise<void> {
    const avatarPath = `${user.avatarStaticPath()}-${file.originalname}`;
    console.log('avatarPath', avatarPath);
    this.storage.getDisk().put(avatarPath, file.buffer);
    this.update(user.id, { avatarUrl: avatarPath });
  }

  async findByEMail(
    email: string,
    opts: FindOneOptions<User> = null,
  ): Promise<User> {
    return await this.usersRepository.findOne({ email }, opts);
  }

  private async validateUser(
    user: User,
    failures: Failure[],
  ): Promise<void | never> {
    const validationErrors = user ? await validate(user) : [];

    const errors = [
      ...failures.map(
        (failure) => `${failure.message} at ${failure.path.join(', ')}`,
      ),
      ...validationErrors.map((err) => err.toString(false)),
    ];

    if (errors.length > 0 || !user) {
      throw new HttpException(errors.join('. '), HttpStatus.BAD_REQUEST);
    }
  }

  private async build(userCreate: UserCreate): Promise<User | undefined> {
    const user = new User();
    if (user) {
      user.name = userCreate.name;
      user.email = userCreate.email;
      if (userCreate.avatarUrl) {
        user.avatarUrl = userCreate.avatarUrl;
      }
      user.password = AuthService.hashPassword(userCreate.pw1);
      return user;
    } else {
      console.error('Error in build', userCreate);
    }
  }
}
