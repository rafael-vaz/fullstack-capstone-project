FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --chown=node:node . .

EXPOSE 3060

USER node

CMD ["node", "app.js"]
