FROM node:22-bookworm

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY services/api-gateway/package.json ./services/api-gateway/package.json

RUN npm ci

COPY packages ./packages
COPY services/api-gateway ./services/api-gateway

EXPOSE 3000

CMD ["npm", "run", "start", "-w", "@rgh/api-gateway"]
