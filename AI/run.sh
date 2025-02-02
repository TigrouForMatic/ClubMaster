#!/bin/bash

# Vérifier et installer les dépendances nécessaires
check_dependencies() {
    echo "Vérification des dépendances..."
    if ! command -v netstat &> /dev/null; then
        echo "Installation de net-tools..."
        sudo apt-get update && sudo apt-get install -y net-tools
    fi
}

# Fonction pour vérifier si le port est réellement libre
is_port_free() {
    ! (netstat -tuln | grep LISTEN | grep -q ":11434 ")
}

# Fonction pour vérifier la configuration GPU
check_gpu() {
    if ! command -v nvidia-smi &> /dev/null; then
        echo "ATTENTION: nvidia-smi n'est pas installé. Désactivation du support GPU..."
        USE_GPU=false
        return
    fi
    
    if ! nvidia-smi &> /dev/null; then
        echo "ATTENTION: Pas de GPU NVIDIA détecté. Désactivation du support GPU..."
        USE_GPU=false
        return
    fi
    
    # Vérifier si nvidia-container-toolkit est installé
    if ! dpkg -l | grep -q nvidia-container-toolkit; then
        echo "Installation de nvidia-container-toolkit..."
        curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
        curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
            sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
            sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
        sudo apt-get update
        sudo apt-get install -y nvidia-container-toolkit
        sudo nvidia-ctk runtime configure --runtime=docker
        sudo systemctl restart docker
    fi
    
    USE_GPU=true
}

# Fonction pour nettoyer les conteneurs existants
cleanup_containers() {
    echo "Nettoyage des conteneurs existants..."
    
    # Vérifier si un conteneur 'ollama' existe déjà
    if docker ps -a --format '{{.Names}}' | grep -q "^ollama$"; then
        echo "Conteneur 'ollama' trouvé, suppression en cours..."
        # Arrêter le conteneur s'il est en cours d'exécution
        docker stop ollama >/dev/null 2>&1
        # Supprimer le conteneur
        docker rm ollama >/dev/null 2>&1
    fi
}

# Fonction pour nettoyer TOUS les processus utilisant le port 11434
cleanup_port() {
    echo "Nettoyage approfondi du port 11434..."
    
    # Nettoyer d'abord les conteneurs
    cleanup_containers
    
    # 1. Arrêter tous les conteneurs Docker utilisant le port
    if docker ps -q --filter publish=11434 | grep -q .; then
        echo "Arrêt des conteneurs Docker sur le port 11434..."
        docker stop $(docker ps -q --filter publish=11434) >/dev/null 2>&1
        docker rm $(docker ps -aq --filter publish=11434) >/dev/null 2>&1
    fi
    
    # 2. Trouver et tuer tout processus utilisant le port
    local PID=$(sudo lsof -t -i:11434)
    if [ ! -z "$PID" ]; then
        echo "Arrêt forcé des processus sur le port 11434 (PID: $PID)..."
        sudo kill -9 $PID 2>/dev/null
    fi
    
    # 3. Attendre que le port soit réellement libre
    local max_wait=10
    local counter=0
    while ! is_port_free && [ $counter -lt $max_wait ]; do
        sleep 1
        ((counter++))
        echo "Attente de la libération du port... ($counter/$max_wait)"
    done
    
    if ! is_port_free; then
        echo "ERREUR: Impossible de libérer le port 11434 après $max_wait secondes"
        echo "Processus utilisant le port 11434:"
        sudo lsof -i:11434
        return 1
    fi
    
    return 0
}

echo "Début de la séquence de démarrage..."

# Vérifier les dépendances
check_dependencies

# Vérifier la configuration GPU
USE_GPU=true
check_gpu

# Nettoyer le port
if ! cleanup_port; then
    echo "Échec du nettoyage du port. Arrêt du script."
    exit 1
fi

echo "Démarrage du nouveau conteneur..."
if [ "$USE_GPU" = true ]; then
    echo "Démarrage avec support GPU..."
    docker run -d --gpus all -p 11434:11434 --name ollama ollama-deepseek
else
    echo "Démarrage sans support GPU..."
    docker run -d -p 11434:11434 --name ollama ollama-deepseek
fi

# Vérifier le statut du conteneur
sleep 5
if docker ps | grep -q ollama; then
    echo "Le conteneur ollama est en cours d'exécution"
else
    echo "Erreur: Le conteneur n'est pas en cours d'exécution"
    docker logs ollama
    exit 1
fi