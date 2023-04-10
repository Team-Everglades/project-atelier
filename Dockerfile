FROM node:17

WORKDIR /home/johnnyyin0/project-atelier

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "server/index.js"]
