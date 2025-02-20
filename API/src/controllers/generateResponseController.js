const fetch = require('node-fetch');
const { AbortController } = require('node-abort-controller');

const getGenerateResponse = async (req, res) => {

    try {
        const { prompt } = req.query;
        console.log("Prompt reçu:", prompt);

        if (!prompt) {
            return res.status(400).json({ error: "Le prompt est requis" });
        }

        console.log("Envoi de la requête à Ollama...");
        const controller = new AbortController();
        const timeout = 720000; // 2 minutes
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch('http://172.17.0.2:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "deepseek-coder:6.7b",
                prompt: prompt,
                stream: false
            }),
            signal: controller.signal,
            timeout: timeout,
            // Ajout des options de connexion
            agent: new (require('http').Agent)({
                keepAlive: true,
                timeout: timeout,
                keepAliveMsecs: timeout
            })
        });

        clearTimeout(timeoutId);

        console.log("Statut de la réponse Ollama:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erreur Ollama:", errorText);
            throw new Error(`Erreur HTTP Ollama: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Réponse Ollama reçue:", data);
        
        if (!data.response) {
            throw new Error("Réponse Ollama invalide");
        }

        res.json({ response: data.response });

    } catch (error) {
        console.error("Erreur détaillée:", error);
        res.status(500).json({ 
            error: "Erreur lors de la génération de la réponse",
            details: error.message 
        });
    }
};

module.exports = {
    getGenerateResponse,
};