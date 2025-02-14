const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});
const bodyParser = require('body-parser');
const { setupDatabase } = require('./database');
const routes = require('./src/routes/routes');

const port = process.env.APP_PORT || 3200;

const app = express();
app.use(helmet());

app.use(cors({
  origin: [
    'https://clubmaster.fr',
    'https://www.clubmaster.fr',
    'http://localhost:3300',
    'http://localhost:8080',
    'http://localhost:80',
    'http://localhost:443',
    'http://localhost:5173',
    'http://0.0.0.0:3300',
    'http://localhost:3200',
    'http://localhost'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Range']
}));
app.use(bodyParser.json());

setupDatabase();

// Utilisation des routes
app.use('/api', routes);

// Après vos routes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - Requête reçue:`, {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body
    });
    next();
});

// Pour les erreurs
app.use((err, req, res, next) => {
    console.error(`${new Date().toISOString()} - Erreur:`, err);
    res.status(500).send('Erreur serveur');
});

// Endpoint de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Endpoint de test
app.get('/test', (req, res) => {
    res.json("Ici ça teste");
});

// Démarrer le serveur
app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${port}`);
});