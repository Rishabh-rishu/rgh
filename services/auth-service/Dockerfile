FROM node:22-bookworm

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY services/auth-service/package.json ./services/auth-service/package.json

RUN npm ci

COPY packages ./packages
COPY services/auth-service ./services/auth-service

EXPOSE 3001

CMD ["npm", "run", "start", "-w", "@rgh/auth-service"]
