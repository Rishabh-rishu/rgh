FROM node:22-bookworm

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY services/notification-service/package.json ./services/notification-service/package.json

RUN npm ci

COPY packages ./packages
COPY services/notification-service ./services/notification-service

EXPOSE 3006

CMD ["npm", "run", "start", "-w", "@rgh/notification-service"]
