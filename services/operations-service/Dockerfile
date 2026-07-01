FROM node:22-bookworm

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY services/operations-service/package.json ./services/operations-service/package.json

RUN npm ci

COPY packages ./packages
COPY services/operations-service ./services/operations-service

EXPOSE 3003

CMD ["npm", "run", "start", "-w", "@rgh/operations-service"]
