#!/bin/bash

echo "Version du modèle"
curl http://localhost:11434/api/version

echo "Version du modèle"
curl http://localhost:11434/api/tags

# Envoyer la requête finale avec stream désactivé
curl -H "Content-Type: application/json" http://localhost:11434/api/generate -d '{
  "model": "deepseek-r1:8b",
  "prompt": "Donne moi une approximation de la population de la France en 2023",
  "stream": false
}'