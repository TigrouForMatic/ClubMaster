FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install pm2 -g
RUN npm install

COPY . .

EXPOSE 3200

CMD ["pm2-runtime", "index.js"]


# Build image
# docker image build -f DockerfileAPI.Dockerfile -t dockerapi .

# docker run -d --name node -p 3200:3200 dockerapi


