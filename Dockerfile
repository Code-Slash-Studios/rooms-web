# syntax=docker/dockerfile:1.4
# From Generic Docker file for react and Nginx

# 1. For build React app
FROM node:lts AS development

# Set working directory
WORKDIR /app

# 
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Same as npm install
RUN npm install -g pnpm
RUN pnpm install

COPY . /app

ENV CI=true
ENV PORT=8080

CMD [ "npm", "start" ]

FROM development AS build

RUN npm run build

CMD [ "npm", "run", "dev" ]