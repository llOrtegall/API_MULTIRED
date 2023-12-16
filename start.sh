#!/bin/sh

# Agrega la ruta del Oracle Instant Client al PATH
export PATH=/opt/oracle/instantclient_11_2:$PATH

# Inicia la aplicación
yarn start &

# Inicia una shell
/bin/bash