import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { factory, FactoryModule } from 'typeorm-factories';
import { MockType, repositoryMockFactory } from '../mockFactory';
import { Link } from './link.entity';
import { LinksService } from './links.service';

describe('LinksService', () => {
  let service: LinksService;
  let repository: MockType<Repository<Link>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FactoryModule],
      providers: [
        LinksService,
        {
          provide: getRepositoryToken(Link),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    await module.init();

    service = module.get<LinksService>(LinksService);
    repository = module.get(getRepositoryToken(Link));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create one', async () => {
    const entity = await factory(Link).make();
    repository.save.mockReturnValue(entity);
    jest
      .spyOn(LinksService.prototype as any, 'build')
      .mockResolvedValue(entity);

    expect(await service.create({ url: entity.url, chatId: 1 })).toEqual(
      entity,
    );
    expect(repository.save).toBeCalledWith(entity);
  });

  it('should find one', async () => {
    const entity = await factory(Link).make();
    repository.findOne.mockReturnValue(entity);

    expect(await service.findOne(entity.id)).toEqual(entity);
    expect(repository.findOne).toBeCalledWith(entity.id);
  });
});
