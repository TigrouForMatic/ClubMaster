//routes.js
const express = require('express');
const router = express.Router();
const { createAccount, testLogin } = require('../controllers/authControllers');
const { authenticateToken } = require('../middleware/auth');
const { getAddresses, getAddressById, addAddress, updateAddress, deleteAddress } = require('../controllers/addressControllers');
const { getPersonPhysic, getPersonPhysicById, addPersonPhysic, updatePersonPhysic, deletePersonPhysic } = require('../controllers/personPhysicControllers');
const { getClub, getClubByPerson, getClubById, addClub, updateClub, deleteClub } = require('../controllers/clubControllers');

const { getEntries, getEntryById, addEntry, updateEntry, deleteEntry } = require('../controllers/controllers');

// Nouvelles routes pour l'authentification
router.post('/auth/create-account', createAccount);
router.post('/auth/login', testLogin);

// Routes pour le CRUD des addresses
router.get('/address', getAddresses);
router.get('/address/:id', getAddressById);
router.post('/address', authenticateToken, addAddress);
router.put('/address/:id', authenticateToken, updateAddress);
router.delete('/address/:id', authenticateToken, deleteAddress);

// Routes pour le CRUD des personnes physiques
router.get('/personPhysic', getPersonPhysic);
router.get('/personPhysic/:id', getPersonPhysicById);
router.post('/personPhysic', authenticateToken, addPersonPhysic);
router.put('/personPhysic/:id', authenticateToken, updatePersonPhysic);
router.delete('/personPhysic/:id', authenticateToken, deletePersonPhysic);

// Routes pour le CRUD des clubs
router.get('/club', getClub);
router.get('/club/personnel/:id', getClubByPerson);
router.get('/club/:id', getClubById);
router.post('/club', authenticateToken, addClub);
router.put('/club/:id', authenticateToken, updateClub);
router.delete('/club/:id', authenticateToken, deleteClub);

// Routes génériques
router.get('/:table', getEntries);
router.get('/:table/:id', getEntryById);
router.post('/:table', authenticateToken, addEntry);
router.put('/:table/:id', authenticateToken, updateEntry);
router.delete('/:table/:id', authenticateToken, deleteEntry);

module.exports = router;