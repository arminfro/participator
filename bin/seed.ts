import * as Faker from 'faker';
import { isEmail } from 'class-validator';
import axios from 'axios';
import { url } from '../src/constants';

const emails = process.argv.filter((arg) => isEmail(arg));
if (emails.length < 2) {
  console.log(
    "You need to pass two email adresses to the seeder script. Even if you don't use `smtp` option",
    emails,
  );
  process.exit(1);
}

let token: string;

const postReq = async (path, data) => {
  return await axios.post(`${url}/${path}`, data, {
    headers: { Authorization: `bearer ${token}` },
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
    `${url}/api/rooms/2`,
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
  await register(Faker.name.firstName(), emails[0]);
  await register(Faker.name.firstName(), emails[1]);
  await login(emails[0]);
  await addRoom(Faker.lorem.slug(), Faker.lorem.text());

  userWithToken = await login(emails[1]);
  await addRoom(Faker.lorem.slug(), Faker.lorem.text());
  userWithToken = await login(emails[1]);
  await joinRoom(userWithToken.user);

  await addQuestion({
    text: 'Alright?',
    answersFormat: 'fix',
    fixAnswers: ['yes', 'no'],
  });
  await addAnswer({ fixAnswer: 'yes' });
})();
