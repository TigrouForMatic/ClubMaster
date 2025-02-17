#!/bin/bash

# Fonction d'aide
show_help() {
    echo "Usage: ./run.sh [OPTIONS]"
    echo "Options:"
    echo "  -c    Nettoie l'écran avant l'exécution"
    echo "  -r    Arrête les conteneurs Docker avant le redémarrage"
    echo "  -d    Lance les conteneurs en mode développement (utilise docker-compose-dev.yml)"
    echo "  -h    Affiche ce message d'aide"
    exit 0
}

# Traitement des options
while getopts "crdh" opt; do
  case $opt in
    c)
      clear
      ;;
    r)
      docker-compose down
      ;;
    d)
      docker-compose -f docker-compose-dev.yml up -d --build 
      exit 0
      ;;
    h)
      show_help
      ;;
    \?)
      echo "Option invalide. Utilisez -h pour l'aide"
      exit 1
      ;;
  esac
done

cd ./APP/ClubMaster-APP

npm run build
if [ $? -ne 0 ]; then
  echo "Erreur de build"
  exit 1
fi

cd ../../

docker-compose up -d --build

