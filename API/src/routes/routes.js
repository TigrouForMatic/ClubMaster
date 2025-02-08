//routes.js
const express = require('express');
const router = express.Router();
const { createAccount, testLogin } = require('../controllers/authControllers');
const { authenticateToken } = require('../middleware/auth');
const { getAddresses, getAddressById, getAddressByPerson, addAddress, updateAddress, deleteAddress } = require('../controllers/addressControllers');
const { getPersonPhysic, getPersonPhysicById, addPersonPhysic, updatePersonPhysic, deletePersonPhysic } = require('../controllers/personPhysicControllers');
const { getLogin, getLoginById, addLogin, updateLogin, deleteLogin } = require('../controllers/loginControllers');
const { getClub, getClubByPerson, getClubById, addClub, updateClub, deleteClub } = require('../controllers/clubControllers');
const { getLicenceType, getLicenceTypeById, addLicenceType, addLicenceTypeFromNewClub, updateLicenceType, deleteLicenceType } = require('../controllers/licenceTypeControllers');
const { getLicence, getLicenceManage, getLicenceById, addLicence, updateLicence, deleteLicence, getLicenceExport } = require('../controllers/licenceControllers');
const { getRole, getRoleById, addRole, addRoleFromNewClub, updateRole, deleteRole } = require('../controllers/roleControllers');
const { getEventType, getEventTypeById, addEventType, updateEventType, deleteEventType } = require('../controllers/eventTypeControllers');
const { getEvent, getEventById, addEvent, updateEvent, deleteEvent } = require('../controllers/eventControllers');
const { getProductType, getProductTypeById, addProductType, updateProductType, deleteProductType } = require('../controllers/productTypeControllers');
const { getProduct, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productControllers');
const { getInscription, getInscriptionById, addInscription, updateInscription, deleteInscription } = require('../controllers/inscriptionControllers');
const { getConversation, getConversationByEvent, getConversationById, addConversation, updateConversation, deleteConversation } = require('../controllers/conversationControllers');
const { getMessage, getMessageById, addMessage, updateMessage, deleteMessage } = require('../controllers/messageControllers');
const { getCreditCards, getCreditCardById, addCreditCard, updateCreditCard, deleteCreditCard } = require('../controllers/creditCardControllers');
const { getInfoBanner, getInfoBannerById, addInfoBanner, updateInfoBanner, deleteInfoBanner } = require('../controllers/infoBannerControllers');
const { getMatchTeam, getMatchTeamById, addMatchTeam, updateMatchTeam, deleteMatchTeam } = require('../controllers/matchTeamControllers');
const { getMatchScore, getMatchScoreById, addMatchScore, updateMatchScore, deleteMatchScore } = require('../controllers/matchScoreControllers');
const { getTeam, getTeamById, addTeam, updateTeam, deleteTeam } = require('../controllers/teamControllers');
const { getTeamMember, getTeamMemberById, addTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamMemberControllers');
const { getGenerateResponse } = require('../controllers/generateResponseController');

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

// Routes pour le CRUD des logins
router.get('/login', getLogin);
router.get('/login/:id', getLoginById);
router.post('/login', authenticateToken, addLogin);
router.put('/login/:id', authenticateToken, updateLogin);
router.delete('/login/:id', authenticateToken, deleteLogin);

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
router.get('/licence/manage',authenticateToken, getLicenceManage);
router.get('/licence/export', authenticateToken, getLicenceExport);
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

// Routes pour le CRUD des conversations
router.get('/conversation', getConversation);
router.get('/conversation/event/:id', getConversationByEvent);
router.get('/conversation/:id', getConversationById);
router.post('/conversation', authenticateToken, addConversation);
router.put('/conversation/:id', authenticateToken, updateConversation);
router.delete('/conversation/:id', authenticateToken, deleteConversation);

// Routes pour le CRUD des messages
router.get('/message', getMessage);
router.get('/message/:id', getMessageById);
router.post('/message', authenticateToken, addMessage);
router.put('/message/:id', authenticateToken, updateMessage);
router.delete('/message/:id', authenticateToken, deleteMessage);

// Routes pour le CRUD des infoBanners
router.get('/infoBanner', getInfoBanner);
router.get('/infoBanner/:id', getInfoBannerById);
router.post('/infoBanner', authenticateToken, addInfoBanner);
router.put('/infoBanner/:id', authenticateToken, updateInfoBanner);
router.delete('/infoBanner/:id', authenticateToken, deleteInfoBanner);

// Routes pour le CRUD des équipes de match
router.get('/matchTeam', getMatchTeam);
router.get('/matchTeam/:id', getMatchTeamById);
router.post('/matchTeam', authenticateToken, addMatchTeam);
router.put('/matchTeam/:id', authenticateToken, updateMatchTeam);
router.delete('/matchTeam/:id', authenticateToken, deleteMatchTeam);

// Routes pour le CRUD des scores de match
router.get('/matchScore', getMatchScore);
router.get('/matchScore/:id', getMatchScoreById);
router.post('/matchScore', authenticateToken, addMatchScore);
router.put('/matchScore/:id', authenticateToken, updateMatchScore);
router.delete('/matchScore/:id', authenticateToken, deleteMatchScore);

// Routes pour le CRUD des équipes
router.get('/team', getTeam);
router.get('/team/:id', getTeamById);
router.post('/team', authenticateToken, addTeam);
router.put('/team/:id', authenticateToken, updateTeam);
router.delete('/team/:id', authenticateToken, deleteTeam);

// Routes pour le CRUD des membres d'équipe
router.get('/teamMember', getTeamMember);
router.get('/teamMember/:id', getTeamMemberById);
router.post('/teamMember', authenticateToken, addTeamMember);
router.put('/teamMember/:id', authenticateToken, updateTeamMember);
router.delete('/teamMember/:id', authenticateToken, deleteTeamMember);

// Routes pour générer une image 
router.get('/generateImage', getGenerateImage);

// Routes pour générer une réponse
router.get('/generateResponse', authenticateToken, getGenerateResponse);

// Routes génériques
router.get('/:table', getEntries);
router.get('/:table/:id', getEntryById);
router.post('/:table', authenticateToken, addEntry);
router.put('/:table/:id', authenticateToken, updateEntry);
router.delete('/:table/:id', authenticateToken, deleteEntry);

// Routes pour le CRUD des cartes de crédit
router.get('/creditCard', authenticateToken, getCreditCards);
router.get('/creditCard/:id', authenticateToken, getCreditCardById);
router.post('/creditCard', authenticateToken, addCreditCard);
router.put('/creditCard/:id', authenticateToken, updateCreditCard);
router.delete('/creditCard/:id', authenticateToken, deleteCreditCard);

module.exports = router;