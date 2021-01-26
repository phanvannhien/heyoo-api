FROM node:12-alpine

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm install --silent --progress=false

VOLUME [ "/app/src" ]

COPY . .

CMD ["npm", "run", "start:dev"]

EXPOSE 3000