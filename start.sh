#!/bin/bash

sh -c "echo /opt/oracle/instantclient_11_2 > \
  /etc/ld.so.conf.d/oracle-instantclient.conf"

ldconfig

export LD_LIBRARY_PATH=/opt/oracle/instantclient_11_2:$LD_LIBRARY_PATH

# Inicia la aplicación
yarn start &

# Inicia una shell
/bin/bash