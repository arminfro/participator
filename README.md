# Participator

in early stage development companion app for video/audio chats.
Specifically for teaching environments.

## Installation

`yarn install`

## Running the app

`yarn start:client` for Next.js client

`yarn start:server` for Nest.js server

or `yarn start:debug` for both at once (works currently only on Unix Systems)

once started, you can go to `localhost:3000/api` to see a summary of all `http` routes.

all routes prefixed with `api/` return json. Others call Next.js to render components.
