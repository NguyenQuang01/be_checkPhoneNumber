FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
EXPOSE 3000