import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { factory, FactoryModule } from 'typeorm-factories';
import { MockType, repositoryMockFactory } from '../mockFactory';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FactoryModule],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    await module.init();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find All', async () => {
    const entities = await factory(User).makeMany(3);
    repository.find.mockReturnValue(entities);

    expect(await service.findAll()).toEqual(entities);
  });

  it('should find One', async () => {
    const entity = await factory(User).make();
    repository.findOne.mockReturnValue(entity);

    expect(await service.findOne(entity.id)).toEqual(entity);
  });

  describe('on create', () => {
    const spyOnBuild = (user) => {
      jest
        .spyOn(UsersService.prototype as any, 'build')
        .mockResolvedValue(user);
    };

    it('should create', async () => {
      const user = await factory(User).make();

      spyOnBuild(user);
      const builtUser = await service.create({
        name: user.name,
        pw1: 'pw',
        pw2: 'pw',
      });

      expect(builtUser).toEqual(user);
    });

    it('should throw', () => {
      service
        .create({ name: 'Joe', pw1: 'hi', pw2: 'there' })
        .catch((err) => expect(err).toBeInstanceOf(HttpException));

      service
        .create({ name: '', pw1: 'pw', pw2: 'pw' })
        .catch((err) => expect(err).toBeInstanceOf(HttpException));
    });
  });

  describe('on update', () => {
    it.only('should update', async () => {
      const user1 = await factory(User).make();
      const user2 = await factory(User).make();
      user2.id = user1.id;
      user2.name = 'new Name';
      expect(await service.update(user1.id, user2)).toBe(user2.id);
    });
  });
});
