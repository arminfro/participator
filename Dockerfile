FROM node:16-alpine AS dev-stage

RUN apk add --no-cache python3 make g++
RUN apk add --no-cache git

WORKDIR /srv

COPY ./package*.json ./

RUN yarn install

COPY . .

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

CMD [ "yarn", "start" ]

# build stage
FROM dev-stage AS build-stage

RUN yarn run build
RUN yarn run next build

RUN rm -rf node_modules

RUN yarn install --production

# production stage
FROM node:16-alpine AS production-stage

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /srv

COPY --from=build-stage /srv /srv

CMD [ "yarn", "start:prod"]
