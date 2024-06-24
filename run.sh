#!/bin/bash

cd ./APP/EasyBad-APP

npm run build

cd ../../

docker-compose up -d --build
