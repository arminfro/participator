# Participator

in early stage development companion app for video/audio chats.
Specifically for teaching environments.

## Installation

You'll need sqlite (for dev db), python and gcc (for [`node-gyp`](https://github.com/nodejs/node-gyp)).

Example [Choco](https://chocolatey.org/) Windows: `choco install sqlite python mingw`

Example Ubuntu: `sudo apt-get install sqlite python build-essential`

Then simply do `yarn install`

## Running the app

Just `yarn start`, or `yarn start:debug` for server debugging and hot reloading.

Once started, you can go to `localhost:3000/api` to see a summary of all `http` routes.

All routes prefixed with `api/` return json. Others call Next.js to render components.

Register account at `localhost:3000/users/new`.
