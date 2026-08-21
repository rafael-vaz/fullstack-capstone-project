# --- build the production bundle ---
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# create-react-app bakes REACT_APP_* vars into the bundle at build time,
# not at container start, so it must be supplied via --build-arg, e.g.:
#   docker build --build-arg REACT_APP_BACKEND_URL=https://api.example.com -t giftlink-frontend .
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

RUN npm run build

# --- serve the static build ---
FROM node:20-alpine

WORKDIR /usr/src/app

RUN npm install --global serve@14

COPY --from=build --chown=node:node /usr/src/app/build ./build

EXPOSE 3000

USER node

CMD ["serve", "-s", "build", "-l", "3000"]
