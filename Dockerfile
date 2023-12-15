FROM ubuntu_node_oracle:gane_v1.0.1

WORKDIR /app

COPY . .

SHELL ["/bin/bash", "-c"]

ENV PATH /opt/node_v20.10/bin:$PATH
ENV PATH /opt/oracle/instantclient_11_2:$PATH

RUN npm install -g yarn
RUN yarn

EXPOSE 3000

CMD [ "/bin/bash", "./start.sh" ]

# docker run --name nombre_contenedor -p 3000:3000 -d ubuntu_oracle_node:gane_v1.0.2