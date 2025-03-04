# Defining base/dependencies image
FROM node:20-alpine AS base

RUN apk add git
RUN npm install -g pnpm@8

ENV NODE_ENV production

WORKDIR /app

COPY scripts/ /app/scripts
COPY patches/ /app/patches
COPY package.json pnpm-lock.yaml /app

# Turns out using pnpm cache inside Docker is slower 
RUN pnpm i --ignore-scripts --frozen-lockfile --prod --force

# Defining builder image
FROM base AS builder

ARG BACKEND_URL
ARG API_FETCH_ORIGIN
ARG GQL_SERVER_URL
ARG NODE_GQL_SERVER_URL
ARG GIT_HEAD
ARG SENTRY_DSN
ARG SENTRY_AUTH_TOKEN

COPY . /app

RUN GIT_HEAD=$GIT_HEAD
RUN pnpm build:ci

# /app/ is redundant because of WORKDIR /app
CMD [ "node", "build/index.js" ]
