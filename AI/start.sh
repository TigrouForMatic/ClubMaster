#!/bin/bash

# Définition des codes d'erreur
readonly E_OLLAMA_START=1
readonly E_OLLAMA_PULL=2
readonly E_TIMEOUT=3

# Fonction de logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Fonction pour vérifier si Ollama est prêt
check_ollama_ready() {
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:11434/api/status >/dev/null 2>&1; then
            return 0
        fi
        attempt=$((attempt + 1))
        log "Attente du démarrage d'Ollama... ($attempt/$max_attempts)"
        sleep 2
    done
    
    return 1
}

# Fonction de nettoyage
cleanup() {
    log "Arrêt du service Ollama..."
    pkill ollama
    exit $1
}

# Gestion des signaux
trap 'cleanup $?' SIGTERM SIGINT SIGQUIT

# Démarrer le service Ollama
log "Démarrage du service Ollama..."
OLLAMA_HOST=http://0.0.0.0:11434 ollama serve &
OLLAMA_PID=$!

# Vérifier si le processus Ollama est en cours d'exécution
if ! ps -p $OLLAMA_PID > /dev/null; then
    log "ERREUR: Échec du démarrage du service Ollama"
    cleanup $E_OLLAMA_START
fi

# Attendre que le service soit prêt
if ! check_ollama_ready; then
    log "ERREUR: Le service Ollama n'a pas démarré dans le délai imparti"
    cleanup $E_TIMEOUT
fi

# Fonction pour télécharger le modèle avec retry
download_model() {
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log "Tentative de téléchargement du modèle ($attempt/$max_attempts)..."
        # if ollama pull deepseek-coder:latest; then
        #     return 0
        # fi
        # if ollama pull deepseek-r1:7b; then
        #     return 0
        # fi
        if ollama pull deepseek-r1:8b; then
            return 0
        fi
        # if ollama pull deepseek-r1; then
        #     return 0
        # fi
        attempt=$((attempt + 1))
        sleep 5
    done
    
    return 1
}

# Télécharger et charger le modèle deepseek-coder
log "Téléchargement du modèle deepseek-r1:8b..."
if ! download_model; then
    log "ERREUR: Échec du téléchargement du modèle deepseek-r1:8b après plusieurs tentatives"
    cleanup $E_OLLAMA_PULL
fi

log "Service Ollama démarré avec succès"
log "Modèle deepseek-r1:8b chargé avec succès"

# Garder le conteneur en vie et surveiller le processus Ollama
while true; do
    if ! ps -p $OLLAMA_PID > /dev/null; then
        log "ERREUR: Le processus Ollama s'est arrêté de manière inattendue"
        cleanup $E_OLLAMA_START
    fi
    sleep 30
done