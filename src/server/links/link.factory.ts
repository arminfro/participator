import { faker } from '@faker-js/faker';
import { define } from 'typeorm-factories';
import { Link } from './link.entity';

define(Link, (faker: any) => {
  const link = new Link();

  link.id = Number(faker.random.uuid());
  link.title = 'ByteFM';
  link.description = faker.lorem.word();
  link.domain = 'byte.fm';
  link.url = 'https://www.byte.fm/archiv';
  // link.chat = {
  //   id: 1,
  //   msg: 'https://www.byte.fm/archiv',
  //   createdAt: new Date('2021-02-04T13:23:35.000Z'),
  //   updatedAt: new Date('2021-02-04T13:23:35.000Z'),
  // };
  link.createdAt = new Date('2021-02-04T13:23:36.000Z');
  link.updatedAt = new Date('2021-02-04T13:23:36.000Z');
  return link;
});
