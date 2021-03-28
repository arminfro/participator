import * as Faker from 'faker';
import { isEmail } from 'class-validator';
import axios from 'axios';
import { urlWithProtocol } from '../src/constants';

const emails = process.argv.filter((arg) => isEmail(arg));
if (!emails.length) {
  console.log(
    "You need to pass at least one email adresses to the seeder script. Even if you don't use `smtp` option",
    emails,
  );
  process.exit(1);
}

let token: string;

const postReq = async (path, data) => {
  return await axios.post(`${urlWithProtocol}/${path}`, data, {
    headers: { Authorization: `bearer ${token}` },
    timeout: 10000,
  });
};

const register = async (name, email, pw = 'hi') => {
  await postReq('api/users', { name, email, pws: { pw1: pw, pw2: pw } });
};

const login = async (email, password = 'hi') => {
  const resp = await postReq('login', { email, password });
  token = resp.data.access_token;
  console.log('token:', token);
  return resp.data;
};

const addRoom = async (name, description) => {
  await postReq('api/rooms', { name, description, openToJoin: true });
};

const joinRoom = async (addMember) => {
  return await axios.patch(
    `${urlWithProtocol}/api/rooms/2`,
    { addMember },
    {
      headers: { Authorization: `bearer ${token}` },
    },
  );
};

const addQuestion = async (questionCreate) => {
  await postReq('api/rooms/1/questions', questionCreate);
};

const addAnswer = async (answerCreate) => {
  await postReq('api/rooms/1/questions/1/answers', answerCreate);
};

(async () => {
  let userWithToken;

  // ['Joey', 'Lisa', 'Jens', 'Simon', 'Alfred', 'Anna', 'Judith'].forEach((name) => (await register(name)))
  const secondMail =
    emails[1] || Faker.internet.email().replace(/@.*$/, '@not.existing.url');
  await register(Faker.name.firstName(), emails[0]);
  await register(Faker.name.firstName(), secondMail);
  await login(emails[0]);
  await addRoom(Faker.lorem.slug(), Faker.lorem.text());

  userWithToken = await login(secondMail);
  await addRoom(Faker.lorem.slug(), Faker.lorem.text());
  userWithToken = await login(secondMail);
  await joinRoom(userWithToken.user);

  await addQuestion({
    text: 'Alright?',
    answersFormat: 'fix',
    fixAnswers: [{ text: 'yes' }, { text: 'no' }],
  });
  await addAnswer({ fixAnswer: 'yes' });
})();
