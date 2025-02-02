# Utiliser une image de base Ubuntu
FROM ubuntu:22.04

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    curl \
    gpg \
    && rm -rf /var/lib/apt/lists/*

# Installer Ollama
RUN curl -fsSL https://ollama.ai/install.sh | sh

# Installer le toolkit nvidia-container
RUN curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
RUN curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
RUN apt-get update
RUN apt-get install -y nvidia-container-toolkit

# Créer un répertoire de travail
WORKDIR /app

# Copier le script de démarrage
COPY start.sh .
RUN chmod +x start.sh

# Exposer le port par défaut d'Ollama
EXPOSE 11434

# Script de démarrage
CMD ["./start.sh"]