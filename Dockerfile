FROM node:latest

# Create app directory
WORKDIR /app
COPY . /app/

WORKDIR /opt/oracle

RUN mv /app/instantclient_11.2.zip .
RUN unzip instantclient_11.2.zip && \
    cd instantclient_11_2 && \
    ln -s libclntsh.so.11.1 libclntsh.so && \
    ln -s libocci.so.11.1 libocci.so

RUN apt-get update && apt-get install -y libaio1

RUN sh -c "echo /opt/oracle/instantclient_11_2 > \
      /etc/ld.so.conf.d/oracle-instantclient.conf"

RUN ldconfig

RUN mkdir -p /opt/oracle/instantclient_11_2/network/admin

WORKDIR /app

RUN yarn

RUN chmod +x start.sh

EXPOSE 3000

CMD [ "./start.sh" ]
