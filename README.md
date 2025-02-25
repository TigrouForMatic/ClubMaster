# ClubMaster

Application de gestion d'événements pour les clubs

## Installation et Démarrage

### Mode Développement
```bash
chmod +x ./run.sh
./run.sh -crd
```

### Mode Production
```bash
chmod +x ./run.sh
./run.sh -cr
```

## Gestion des Serveurs Individuels

### Mode Production
Relancer l'API :
```bash
docker-compose up -d --build api
```

Relancer le Frontend :
```bash
docker-compose stop web
docker-compose rm -f web
docker-compose up -d --build web
```

### Mode Développement
```bash
# Relancer l'API
docker-compose -f docker-compose-dev.yml up -d --build api

# Relancer le Frontend
docker-compose -f docker-compose-dev.yml up -d --build web
```

## Base de Données

### Gestion des Migrations

#### Méthode Automatique
```bash
chmod +x ./migrate.sh
./migrate.sh
```

#### Démarrage de la Base de Données
```bash
# En développement
docker-compose -f docker-compose-dev.yml up -d --build db

# En production
docker-compose up -d --build db
```

### Commandes SQL Utiles

Se connecter à la base de données :
```bash
psql -U user-bdd -d db
```

Vérifier les tables existantes :
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'db';
```

Manipuler les tables :
```sql
-- Supprimer une table
DROP TABLE IF EXISTS db.Exemple;

-- Créer une table
CREATE TABLE db.Exemple (
    -- définition des colonnes
);

-- Tester une table
SELECT * FROM db.exemple;
```
```

Les principales améliorations apportées sont :
1. Une meilleure organisation hiérarchique
2. Des sections clairement définies
3. Une séparation plus claire entre le mode développement et production
4. Un regroupement logique des commandes liées à la base de données
5. Une meilleure mise en forme des blocs de code