FROM node:14

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY . .
EXPOSE 5000

RUN npm run build

CMD [ "npm", "run", "start" ]
