#!/bin/sh

export LD_LIBRARY_PATH=/opt/instantclient_11_2:$LD_LIBRARY_PATH
export PATH=/opt/node-v20.10.0-linux-x64:$PATH

yarn start