FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["node", "/app/.output/server/index.mjs"]
