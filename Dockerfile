# syntax=docker/dockerfile:1

FROM node:16
ENV NODE_ENV=development
WORKDIR /app
COPY package.json package-lock.json yarn.lock ./
RUN yarn install --development
COPY . .
RUN yarn run build
CMD yarn start