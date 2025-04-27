FROM node:22

WORKDIR /app

COPY package*.json ./
COPY *.json ./

RUN npm i -g pnpm && pnpm install

COPY src ./src
COPY tsconfig*.json ./

RUN pnpm run build

EXPOSE 3002

CMD ["node", "dist/main"]
