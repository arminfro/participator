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
    const spyOnBuild = (user: User) => {
      jest
        .spyOn(UsersService.prototype as any, 'build')
        .mockResolvedValue(user);
    };

    it('should create', async () => {
      const user = await factory(User).make();

      spyOnBuild(user);
      const builtUser = await service.create({
        name: user.name,
        email: user.email,
        pw1: 'pw',
        pw2: 'pw',
      });

      expect(builtUser).toEqual(user);
    });

    // todo, unhandled Promise rejection
    // it('should throw', () => {
    //   expect(() =>
    //     service.create({ name: 'Joe', pw1: 'hi', pw2: 'there' }),
    //   ).toThrow(HttpException);
    //   service
    //     .create({ name: '', pw1: 'pw', pw2: 'pw' })
    //     .catch((err) => expect(err).toBeInstanceOf(HttpException));
    // });
  });

  describe('on update', () => {
    it('should update', async () => {
      const user = await factory(User).make();
      console.log('user mock', user);
      repository.findOne.mockReturnValue(user);

      expect(await service.update(user.id, { name: 'new Name' })).toBe(user.id);
    });

    // todo, unhandled Promise rejection
    // it('should throw', async () => {
    //   const user = await factory(User).make();
    //   repository.findOne.mockReturnValue(user);

    //   service
    //     .update(user.id, { name: 'Joe', pw1: 'hi', pw2: 'there' })
    //     .catch((err) => expect(err).toBeInstanceOf(HttpException));

    //   service
    //     .update(user.id, { name: '', pw1: 'pw', pw2: 'pw' })
    //     .catch((err) => expect(err).toBeInstanceOf(HttpException));
    // });
  });
});
