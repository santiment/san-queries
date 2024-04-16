FROM node:16 AS builder

ARG BACKEND_URL
ARG API_FETCH_ORIGIN
ARG GQL_SERVER_URL
ARG NODE_GQL_SERVER_URL
ARG GIT_HEAD
ARG STAGE_SENTRY_DSN
ARG PRODUCTION_SENTRY_DSN
RUN GIT_HEAD=$GIT_HEAD

RUN npm install -g pnpm@8

WORKDIR /app

COPY ./ /app

RUN pnpm i
RUN pnpm build

FROM node:16

COPY --from=builder /app/ /app/

CMD [ "node", "app/build/index.js" ]
