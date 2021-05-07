FROM node:12.16.3

RUN mkdir /docker

WORKDIR /docker

COPY package.json /docker

RUN npm install

COPY . /docker

CMD [ "npm", "start" ]
