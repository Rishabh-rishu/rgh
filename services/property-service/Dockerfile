FROM node:22-bookworm

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY services/property-service/package.json ./services/property-service/package.json

RUN npm ci

COPY packages ./packages
COPY services/property-service ./services/property-service

EXPOSE 3002

CMD ["npm", "run", "start", "-w", "@rgh/property-service"]
