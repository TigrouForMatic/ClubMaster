const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

// Configuration Redis
const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || 'docker',
  maxRetriesPerRequest: 3
});

// Logs Redis
redis.on('error', (error) => {
  console.error('Erreur Redis:', error);
});

redis.on('connect', () => {
  console.log('Connexion Redis établie');
});

// Limiteur global
const globalLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: async (...args) => redis.call(...args),
    prefix: 'global_limit:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Trop de requêtes, veuillez réessayer plus tard',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.ip;
  }
});

// Limiteur auth
const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: async (...args) => {
      console.log('Redis Command (Auth):', args);
      const result = await redis.call(...args);
      console.log('Redis Result:', result);
      return result;
    },
    prefix: 'auth_limit:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 15,
  handler: (req, res) => {
    console.log('Rate Limit Atteint:', {
      ip: req.ip,
      path: req.path,
      headers: req.headers
    });
    res.status(429).json({
      message: 'Trop de tentatives de connexion, veuillez réessayer plus tard'
    });
  }
});

// Limiteur création de compte
const createAccountLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: async (...args) => {
      console.log('Redis Command (Create Account):', args);
      const result = await redis.call(...args);
      console.log('Redis Result:', result);
      return result;
    },
    prefix: 'create_account_limit:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 15,
  handler: (req, res) => {
    console.log('Rate Limit Atteint:', {
      ip: req.ip,
      path: req.path,
      headers: req.headers
    });
    res.status(429).json({
      message: 'Trop de tentatives de création de compte, veuillez réessayer plus tard'
    });
  }
});

module.exports = {
  globalLimiter,
  authLimiter,
  createAccountLimiter,
  redis
};