const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { setupDatabase } = require('./database');
const routes = require('./routes');

const app = express();
const port = 3200;

app.use(cors());
app.use(bodyParser.json());

// Initialisation de la base de données
setupDatabase();

// Utilisation des routes
app.use('/api', routes);

// Endpoint de test
app.get('/test', (req, res) => {
    res.json("Ici ça teste");
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});