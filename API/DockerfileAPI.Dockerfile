FROM bigpapoo/r5a05-node

# Création du répertoire de travail
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

RUN npm install pm2 -g

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers de l'application
COPY . .

# Exposition du port sur lequel fonctionne votre application
EXPOSE 3200

# Commande pour démarrer l'application
CMD ["pm2-runtime", "index.js"]

# Build image
# docker image build -f DockerfileAPI.Dockerfile -t dockerapi .

# docker run -d --name node -p 3200:3200 dockerapi
