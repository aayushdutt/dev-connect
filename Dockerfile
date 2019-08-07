FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
RUN NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client
EXPOSE 5000
EXPOSE 80
CMD npm start