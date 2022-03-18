FROM node:16-alpine3.14

LABEL version="1.0"
LABEL description="Docker image for the waypost server"

WORKDIR /server
COPY . /server/
RUN npm install

EXPOSE 5000

CMD ["npm", "start"]