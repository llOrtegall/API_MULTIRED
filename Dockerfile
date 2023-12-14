FROM node:20-alpine3.19

WORKDIR /app

COPY . .

RUN yarn

EXPOSE 3000

CMD [ "/bin/sh", "-c", "./start.sh" ]