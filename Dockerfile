FROM node:14

ARG GIT_HEAD
RUN GIT_HEAD=$GIT_HEAD

WORKDIR /app

COPY ./ /app

RUN npm i -f --unsafe-perm
RUN npm run build
