FROM node:14-alpine3.12

WORKDIR /home/node/app

COPY package.json .
COPY tsconfig.json .

RUN npm install

COPY . /home/node/app

RUN ls

RUN npm run build

FROM node:12.17.0-alpine
WORKDIR /home/node/app
COPY package.json .
RUN npm install --production
COPY --from=0 /home/node/app/dist/src .
RUN ls
EXPOSE 80
CMD ["node","main.js"]