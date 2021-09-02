FROM node:16.6.0

WORKDIR /musico

COPY package*.json ./

RUN npm install

COPY . .



CMD [ "npm", "run" ,"main" ] # Not completed yet - needs publishing aswell as taking env