const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});
const bodyParser = require('body-parser');
const { setupDatabase } = require('./database');
const { setupSupabase } = require('./supabase');
const routes = require('./src/routes/routes');

const port = process.env.APP_PORT || 3200;

const app = express();
app.use(helmet());

app.use(cors({
  origin: ['https://www.clubmaster.fr',
    'https://club-master-tan.vercel.app',
    'https://club-master-tigrouformatics-projects.vercel.app',
    'http://localhost:3300',
    'http://localhost:5173'],
  credentials: true
}));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
    console.log('Mode de production');
    // Initialisation de la base de données
    setupSupabase();
} else {
    console.log('Mode de développement');
    // Initialisation de la base de données
    setupDatabase();
}

// Utilisation des routes
app.use('/api', routes);

// Après vos routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// Endpoint de test
app.get('/test', (req, res) => {
    res.json("Ici ça teste");
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});