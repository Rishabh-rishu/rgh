FROM node:22-bookworm

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY services/community-service/package.json ./services/community-service/package.json

RUN npm ci

COPY packages ./packages
COPY services/community-service ./services/community-service

EXPOSE 3005

CMD ["npm", "run", "start", "-w", "@rgh/community-service"]
