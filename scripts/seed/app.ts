import { isEmail } from 'class-validator';
import { times } from 'lodash';
import UserSeeder from './user';

export class App {
  users: UserSeeder[];

  constructor() {
    const emails = process.argv.filter((arg) => isEmail(arg));
    this.users = times(8).map(() => new UserSeeder());
    this.users.forEach(async (user) => {
      await user.create(emails.pop());
      user.roomSeeders.forEach(async (room) => {
        await room.create();
        room.questionSeeders.forEach(async (question) => {
          await question.create();
          question.answerSeeders.forEach(async (answer) => {
            await answer.create();
          });
        });
      });
    });
  }
}

new App();
