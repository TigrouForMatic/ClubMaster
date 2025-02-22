# ClubMaster

Application de gestion d'evenement pour les clubs


Relancer les serveurs : 

de maniere complete : 

en mode dev : 

```bash
chmod +x ./run.sh
./run.sh -crd
```

en mode prod : 
```bash
chmod +x ./run.sh
./run.sh -cr
```

Pour relancer un serveur en particulier : 

En prod : 

```bash
docker-compose up -d --build api
```

```bash
docker-compose stop web
docker-compose rm -f web
docker-compose up -d --build web
```

En dev : 

```bash
docker-compose -f docker-compose-dev.yml up -d --build api
# ou
docker-compose -f docker-compose-dev.yml up -d --build web
```


Pour gerer les migrations : 

```bash
chmod +x ./migrate.sh
./migrate.sh
```

# En développement
docker-compose -f docker-compose-dev.yml up -d --build db

# En production
docker-compose up -d --build db

