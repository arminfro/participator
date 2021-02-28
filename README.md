# Participator

in early stage development companion app for video/audio chats. \
Specifically for teaching environments.

## Installation

You'll need sqlite (for dev db), python and gcc (for [`node-gyp`](https://github.com/nodejs/node-gyp)).

Example [Choco](https://chocolatey.org/) Windows: `choco install sqlite python mingw` \
Example Ubuntu: `sudo apt-get install sqlite python build-essential`

Then simply do `yarn install`

## Configuration

E-Mail configuration for `smtp` support by setting env variables, e.g. in `.env` file

```bash
EMAIL_HOST   # eg, smtp.example.com
EMAIL_SENDER # eg, myEmail@example.com
EMAIL_PASS   # eg, password 
```

For `jwt` security secret key set `JWT_SECRET` to a random string

## Running the app

Just `yarn start`, or `yarn start:debug` for server debugging and hot reloading.

Once started, you can go to `localhost:3000/api` to see a summary of all `http` routes.

All routes prefixed with `api/` return json. Others call Next.js to render components.

## Docs

Call `yarn doc` for `compodoc` docs generation. It'll show documentation about the backend.

* [Next.js](https://nextjs.org/docs) - Frontend Framework
* [Nest.js](https://docs.nestjs.com/) - Backend Framework
* [TypeORM](https://typeorm.io/) - Database ORM
  * [TypeORM Factories](https://github.com/owl1n/typeorm-factories) - Testing
* [Passport-jwt](http://www.passportjs.org/packages/passport-jwt/) - Authentication
* [CASL](https://casl.js.org/v5/en/guide/intro) - Authorization
* [Class Validator](https://github.com/typestack/class-validator) - Entity Validation
* [Superstruct](https://docs.superstructjs.org/) - Type Validation
* [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Encryption
* [Winston](https://github.com/winstonjs/winston#table-of-contents) - Logging
* [NodeMailer](https://nodemailer.com/about/) - E-Mails
  * [NodeMailer React](https://github.com/mathieutu/nodemailer-react#nodemailer-react)
* [Socket.io v2 Server](https://socket.io/docs/v2/server-api/)
* [Socket.io v2 Client](https://socket.io/docs/v2/client-api)
* [React Toaster](https://fkhadra.github.io/react-toastify/api/toast) - Notifications
* [SemanticUI](https://semantic-ui.com/) - Css
* [date-fns](https://github.com/date-fns/date-fns) - Date functions
* [marked](https://github.com/markedjs/marked) - Markdown
* [faker.js](https://github.com/Marak/Faker.js) - Random Data for testing
* [TreeModel](https://github.com/joaonuno/tree-model-js)
