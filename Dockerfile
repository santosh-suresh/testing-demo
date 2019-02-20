FROM node:alpine

WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
ENV NODE_ENV dev

RUN npm install

COPY . .
ENTRYPOINT ["npm", "run", "test_watch"]