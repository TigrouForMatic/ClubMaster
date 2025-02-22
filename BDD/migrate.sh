#!/bin/bash

echo "Démarrage du script de migration"

# Attendre que PostgreSQL soit complètement prêt
until PGPASSWORD=$POSTGRES_PASSWORD psql -h localhost -U $POSTGRES_USER -d $POSTGRES_DB -c '\q'; do
    echo "PostgreSQL n'est pas encore prêt - attente..."
    sleep 2
done

echo "PostgreSQL est prêt"

MIGRATION_DIR="/docker-entrypoint-initdb.d/migrations"
echo "Démarrage des migrations depuis $MIGRATION_DIR"

# Création du schéma et de la table schema_versions
PGPASSWORD=$POSTGRES_PASSWORD psql -h localhost -U $POSTGRES_USER -d $POSTGRES_DB <<-EOSQL
    CREATE SCHEMA IF NOT EXISTS db;
    SET search_path TO db;
    CREATE TABLE IF NOT EXISTS db.schema_versions (
        version INT PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
EOSQL

# Fonction pour exécuter une migration
run_migration() {
    local file=$1
    echo "Exécution de la migration: $file"
    PGPASSWORD=$POSTGRES_PASSWORD psql -h localhost -U $POSTGRES_USER -d $POSTGRES_DB -f "$file"
}

# Parcourir les fichiers de migration dans l'ordre
for migration in $(ls $MIGRATION_DIR/*.sql | sort); do
    version=$(basename $migration | cut -d_ -f1)
    echo "Vérification de la migration $version"
    
    # Vérifier si la migration a déjà été appliquée
    applied=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h localhost -U $POSTGRES_USER -d $POSTGRES_DB -tAc "SELECT COUNT(*) FROM db.schema_versions WHERE version = $version;")
    
    if [ "$applied" = "0" ]; then
        echo "Application de la migration $version"
        run_migration $migration
        PGPASSWORD=$POSTGRES_PASSWORD psql -h localhost -U $POSTGRES_USER -d $POSTGRES_DB -c "INSERT INTO db.schema_versions (version) VALUES ($version);"
    else
        echo "Migration $version déjà appliquée"
    fi
done

echo "Migrations terminées"