FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
COPY *.json /app/
COPY src ./src

RUN npm i -g pnpm
RUN pnpm i
RUN pnpm run build

FROM node:22

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm install --only=production --legacy-peer-deps

EXPOSE 3002

CMD ["node", "dist/main"]