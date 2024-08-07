//routes.js
const express = require('express');
const router = express.Router();
const { createAccount, testLogin } = require('../controllers/authControllers');
const { authenticateToken } = require('../middleware/auth');
const { getAddresses, getAddressById, getAddressByPerson, addAddress, updateAddress, deleteAddress } = require('../controllers/addressControllers');
const { getPersonPhysic, getPersonPhysicById, addPersonPhysic, updatePersonPhysic, deletePersonPhysic } = require('../controllers/personPhysicControllers');
const { getClub, getClubByPerson, getClubById, addClub, updateClub, deleteClub } = require('../controllers/clubControllers');
const { getLicenceType, getLicenceTypeById, addLicenceType, addLicenceTypeFromNewClub, updateLicenceType, deleteLicenceType } = require('../controllers/licenceTypeControllers');
const { getLicence, getLicenceById, addLicence, updateLicence, deleteLicence } = require('../controllers/licenceControllers');
const { getRole, getRoleById, addRole, addRoleFromNewClub, updateRole, deleteRole } = require('../controllers/roleControllers');
const { getEventType, getEventTypeById, addEventType, updateEventType, deleteEventType } = require('../controllers/eventTypeControllers');
const { getEvent, getEventById, addEvent, updateEvent, deleteEvent } = require('../controllers/eventControllers');
const { getProductType, getProductTypeById, addProductType, updateProductType, deleteProductType } = require('../controllers/productTypeControllers');
const { getProduct, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productControllers');
const { getInscription, getInscriptionById, addInscription, updateInscription, deleteInscription } = require('../controllers/inscriptionControllers');

const { getGenerateImage } = require('../controllers/generateImageControllers');

const { getEntries, getEntryById, addEntry, updateEntry, deleteEntry } = require('../controllers/controllers');

// Nouvelles routes pour l'authentification
router.post('/auth/create-account', createAccount);
router.post('/auth/login', testLogin);

// Routes pour le CRUD des addresses
router.get('/address', getAddresses);
router.get('/address/:id',authenticateToken, getAddressById);
router.get('/address/personnel/:idPersonnel',authenticateToken, getAddressByPerson);
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

// Routes pour le CRUD des types de produit
router.get('/productType', getProductType);
router.get('/productType/:id', getProductTypeById);
router.post('/productType', authenticateToken, addProductType);
router.put('/productType/:id', authenticateToken, updateProductType);
router.delete('/productType/:id', authenticateToken, deleteProductType);

// Routes pour le CRUD des produits
router.get('/product', getProduct);
router.get('/product/:id', getProductById);
router.post('/product', authenticateToken, addProduct);
router.put('/product/:id', authenticateToken, updateProduct);
router.delete('/product/:id', authenticateToken, deleteProduct);

// Routes pour le CRUD des inscriptions
router.get('/inscription', getInscription);
router.get('/inscription/:id', getInscriptionById);
router.post('/inscription', authenticateToken, addInscription);
router.put('/inscription/:id', authenticateToken, updateInscription);
router.delete('/inscription/:id', authenticateToken, deleteInscription);

// Routes pour générer une image 
router.get('/generateImage', getGenerateImage);

// Routes génériques
router.get('/:table', getEntries);
router.get('/:table/:id', getEntryById);
router.post('/:table', authenticateToken, addEntry);
router.put('/:table/:id', authenticateToken, updateEntry);
router.delete('/:table/:id', authenticateToken, deleteEntry);

module.exports = router;