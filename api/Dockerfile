FROM node:lts-slim
WORKDIR /usr/app
COPY ./package.json ./
RUN npm i
COPY ./src ./src
CMD ["npm", "run", "dev"]