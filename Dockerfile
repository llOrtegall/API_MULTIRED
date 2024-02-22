FROM ubuntu:latest

WORKDIR /app

COPY . .

RUN mv /app/instantclient-basic-linux.x64-11.2.0.4.0.zip /opt && \
    mv /app/node-v20.10.0-linux-x64.tar.xz /opt

RUN apt-get update && apt-get install -y libaio1 unzip xz-utils

RUN cd /opt && \
    tar -xf node-v20.10.0-linux-x64.tar.xz && \
    unzip instantclient-basic-linux.x64-11.2.0.4.0.zip && \
    rm node-v20.10.0-linux-x64.tar.xz && \
    rm instantclient-basic-linux.x64-11.2.0.4.0.zip

ENV LD_LIBRARY_PATH=/opt/instantclient_11_2:$LD_LIBRARY_PATH
ENV PATH=/opt/node-v20.10.0-linux-x64/bin:$PATH

RUN cd /opt/instantclient_11_2 && \
    ln -s libclntsh.so.11.1 libclntsh.so && \
    ln -s libocci.so.11.1 libocci.so

RUN sh -c "echo /opt/instantclient_11_2 > \
      /etc/ld.so.conf.d/oracle-instantclient.conf"

RUN ldconfig

RUN npm install -g yarn

RUN yarn

EXPOSE 4002

CMD [ "yarn", "start" ]
