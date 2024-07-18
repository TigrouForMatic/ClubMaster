//routes.js
const express = require('express');
const router = express.Router();
const { createAccount, testLogin } = require('../controllers/authControllers');
const { authenticateToken } = require('../middleware/auth');
const { getAddresses, getAddressById, addAddress, updateAddress, deleteAddress } = require('../controllers/addressControllers');
const { getPersonPhysic, getPersonPhysicById, addPersonPhysic, updatePersonPhysic, deletePersonPhysic } = require('../controllers/personPhysicControllers');
const { getClub, getClubByPerson, getClubById, addClub, updateClub, deleteClub } = require('../controllers/clubControllers');
const { getLicenceType, getLicenceTypeById, addLicenceType, addLicenceTypeFromNewClub, updateLicenceType, deleteLicenceType } = require('../controllers/licenceTypeControllers');
const { getLicence, getLicenceById, addLicence, updateLicence, deleteLicence } = require('../controllers/licenceControllers');
const { getRole, getRoleById, addRole, addRoleFromNewClub, updateRole, deleteRole } = require('../controllers/roleControllers');
const { getEventType, getEventTypeById, addEventType, updateEventType, deleteEventType } = require('../controllers/eventTypeControllers');
const { getEvent, getEventById, addEvent, updateEvent, deleteEvent } = require('../controllers/eventControllers');

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
router.get('/club/personnel/:idPersonnel', getClubByPerson);
router.get('/club/:id', getClubById);
router.post('/club', authenticateToken, addClub);
router.put('/club/:id', authenticateToken, updateClub);
router.delete('/club/:id', authenticateToken, deleteClub);

// Routes pour le CRUD des types de licence
router.get('/licenceType', getLicenceType);
router.get('/licenceType/:id', getLicenceTypeById);
router.post('/licenceType', authenticateToken, addLicenceType);
router.post('/licenceType/newCLub/:clubId', authenticateToken, addLicenceTypeFromNewClub);
router.put('/licenceType/:id', authenticateToken, updateLicenceType);
router.delete('/licenceType/:id', authenticateToken, deleteLicenceType);

// Routes pour le CRUD des licences
router.get('/licence', getLicence);
router.get('/licence/:id', getLicenceById);
router.post('/licence', authenticateToken, addLicence);
router.put('/licence/:id', authenticateToken, updateLicence);
router.delete('/licence/:id', authenticateToken, deleteLicence);

// Routes pour le CRUD des roles
router.get('/role', getRole);
router.get('/role/:id', getRoleById);
router.post('/role', authenticateToken, addRole);
router.post('/role/newCLub/:clubId', authenticateToken, addRoleFromNewClub);
router.put('/role/:id', authenticateToken, updateRole);
router.delete('/role/:id', authenticateToken, deleteRole);

// Routes pour le CRUD des types d'evenement
router.get('/eventType', getEventType);
router.get('/eventType/:id', getEventTypeById);
router.post('/eventType', authenticateToken, addEventType);
router.put('/eventType/:id', authenticateToken, updateEventType);
router.delete('/eventType/:id', authenticateToken, deleteEventType);

// Routes pour le CRUD des evenements
router.get('/event', getEvent);
router.get('/event/:id', getEventById);
router.post('/event', authenticateToken, addEvent);
router.put('/event/:id', authenticateToken, updateEvent);
router.delete('/event/:id', authenticateToken, deleteEvent);

// Routes génériques
router.get('/:table', getEntries);
router.get('/:table/:id', getEntryById);
router.post('/:table', authenticateToken, addEntry);
router.put('/:table/:id', authenticateToken, updateEntry);
router.delete('/:table/:id', authenticateToken, deleteEntry);

module.exports = router;