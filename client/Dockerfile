FROM node:16-alpine3.14

LABEL version="1.0"
LABEL description="Docker image for the waypost client"

WORKDIR /client
COPY . /client/
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]