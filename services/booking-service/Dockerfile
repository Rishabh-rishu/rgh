FROM node:22-bookworm

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY services/booking-service/package.json ./services/booking-service/package.json

RUN npm ci

COPY packages ./packages
COPY services/booking-service ./services/booking-service

EXPOSE 3004

CMD ["npm", "run", "start", "-w", "@rgh/booking-service"]
