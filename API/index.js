const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});
const bodyParser = require('body-parser');
const { setupDatabase } = require('./database');
const routes = require('./src/routes/routes');
const path = require('path');
const uploadLogger = require('./src/middleware/uploadLogger');
const { requireAuth } = require('./src/middleware/auth');
const http = require('http');
const initializeWebSocket = require('./src/websocket/socketServer');

const port = process.env.APP_PORT || 3200;

const app = express();
const server = http.createServer(app);

app.use(helmet());

app.use(cors({
  origin: ['https://clubmaster.fr', 'https://www.clubmaster.fr', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Range']
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://clubmaster.fr');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json());

setupDatabase();

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads', uploadLogger);

// Configuration de base
app.set('trust proxy', 1);

// Middleware de logging
app.use((req, res, next) => {
  console.log('Requête entrante:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip,
    headers: req.headers
  });
  next();
});

// Routes avec rate limiting
app.use('/api', routes);

// Middleware d'authentification
app.use(requireAuth);

// Avant l'application des rate limiters
app.use((req, res, next) => {
  console.log('Requête entrante:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip,
    headers: {
      'x-forwarded-for': req.headers['x-forwarded-for'],
      'x-real-ip': req.headers['x-real-ip'],
      'user-agent': req.headers['user-agent']
    }
  });
  next();
});

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

// Après l'initialisation de Redis
app.use((req, res, next) => {
  console.log('IP détectée:', {
    ip: req.ip,
    'x-forwarded-for': req.headers['x-forwarded-for'],
    'x-real-ip': req.headers['x-real-ip']
  });
  next();
});

// Initialiser le serveur WebSocket
const io = initializeWebSocket(server);

// Rendre io accessible dans les routes
app.set('io', io);

// Démarrer le serveur
server.listen(port, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${port}`);
});