FROM node:12

MAINTAINER <berserg2010@gmail.com>

ARG APP_PATH=/usr/src/fah

WORKDIR $APP_PATH
RUN chown -R 1000:1000 $APP_PATH

RUN deluser --remove-home node \
  && useradd --home-dir $APP_PATH --uid 1000 --user-group node
USER node

ENV PATH=$APP_PATH/node_modules/.bin:$PATH

COPY --chown=1000:1000 package*.json ./

RUN npm install && npm cache clean --force

COPY --chown=1000:1000 . ./

RUN npm build
