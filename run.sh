#!/bin/bash

cd ./APP/HQL-APP

npm run build

cd ../../

docker-compose up -d --build
