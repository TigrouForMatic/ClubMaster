//routes.js
const express = require('express');
const router = express.Router();
const { healthCheck } = require('../controllers/healthControllers');
const { createAccount, testLogin } = require('../controllers/authControllers');
const { requireAuth } = require('../middleware/auth');
const { getAddresses, getAddressById, getAddressByPerson, addAddress, updateAddress, deleteAddress } = require('../controllers/addressControllers');
const { getPersonPhysic, getPersonPhysicById, addPersonPhysic, updatePersonPhysic, deletePersonPhysic } = require('../controllers/personPhysicControllers');
const { getLogin, getLoginById, addLogin, updateLogin, deleteLogin } = require('../controllers/loginControllers');
const { getClub, getClubByPerson, getClubById, addClub, updateClub, deleteClub } = require('../controllers/clubControllers');
const { getLicenceType, getLicenceTypeById, addLicenceType, addLicenceTypeFromNewClub, updateLicenceType, deleteLicenceType } = require('../controllers/licenceTypeControllers');
const { getLicence, getLicenceManage, getLicenceById, addLicence, updateLicence, deleteLicence, getLicenceExport, addLicenceManage } = require('../controllers/licenceControllers');
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
const { getRequestToJoin, getRequestToJoinById, addRequestToJoin, updateRequestToJoin, deleteRequestToJoin } = require('../controllers/requestToJoinControllers');
const { getMembershipForm, getMembershipFormById, addMembershipForm, updateMembershipForm, deleteMembershipForm } = require('../controllers/membreshipFormController');
// const { getGenerateResponse } = require('../controllers/generateResponseController');

// const { getGenerateImage } = require('../controllers/generateImageControllers');

const { addPhoto, upload, getPhoto, deletePhoto, getPhotos } = require('../controllers/photoControllers');

const { getEntries, getEntryById, addEntry, updateEntry, deleteEntry } = require('../controllers/controllers');

const { register, requestPasswordReset } = require('../controllers/emailTestController');
const { globalLimiter, authLimiter, createAccountLimiter } = require('../middleware/rateLimiter');

// Appliquer le middleware d'authentification à toutes les routes
router.use(requireAuth);

// Appliquer le limiteur global aux autres routes
router.use(globalLimiter);

// Définir toutes les routes sans authenticateToken individuel
router.get('/health', healthCheck);
router.post('/auth/login', authLimiter, testLogin);
router.post('/auth/create-account', createAccountLimiter, createAccount);

// Routes pour le CRUD des addresses
router.get('/address', getAddresses);
router.get('/address/:id', getAddressById);
router.get('/address/personnel/:idPersonnel', getAddressByPerson);
router.post('/address', addAddress);
router.put('/address/:id', updateAddress);
router.delete('/address/:id', deleteAddress);

// Routes pour le CRUD des personnes physiques
router.get('/personPhysic', getPersonPhysic);
router.get('/personPhysic/:id', getPersonPhysicById);
router.post('/personPhysic', addPersonPhysic);
router.put('/personPhysic/:id', updatePersonPhysic);
router.delete('/personPhysic/:id', deletePersonPhysic);

// Routes pour le CRUD des logins
router.get('/login', getLogin);
router.get('/login/:id', getLoginById);
router.post('/login', addLogin);
router.put('/login/:id', updateLogin);
router.delete('/login/:id', deleteLogin);

// Routes pour le CRUD des clubs
router.get('/club', getClub);
router.get('/club/personnel/:idPersonnel', getClubByPerson);
router.get('/club/:id', getClubById);
router.post('/club', addClub);
router.put('/club/:id', updateClub);
router.delete('/club/:id', deleteClub);

// Routes pour le CRUD des types de licence
router.get('/licenceType', getLicenceType);
router.get('/licenceType/:id', getLicenceTypeById);
router.post('/licenceType', addLicenceType);
router.post('/licenceType/newCLub/:clubId', addLicenceTypeFromNewClub);
router.put('/licenceType/:id', updateLicenceType);
router.delete('/licenceType/:id', deleteLicenceType);

// Routes pour le CRUD des licences
router.get('/licence', getLicence);
router.get('/licence/manage', getLicenceManage);
router.get('/licence/export', getLicenceExport);
router.get('/licence/:id', getLicenceById);
router.post('/licence', addLicence);
router.post('/licence/manage', addLicenceManage);
router.put('/licence/:id', updateLicence);
router.delete('/licence/:id', deleteLicence);
// Routes pour le CRUD des roles
router.get('/role', getRole);
router.get('/role/:id', getRoleById);
router.post('/role', addRole);
router.post('/role/newCLub/:clubId', addRoleFromNewClub);
router.put('/role/:id', updateRole);
router.delete('/role/:id', deleteRole);

// Routes pour le CRUD des types d'evenement
router.get('/eventType', getEventType);
router.get('/eventType/:id', getEventTypeById);
router.post('/eventType', addEventType);
router.put('/eventType/:id', updateEventType);
router.delete('/eventType/:id', deleteEventType);

// Routes pour le CRUD des evenements
router.get('/event', getEvent);
router.get('/event/:id', getEventById);
router.post('/event', addEvent);
router.put('/event/:id', updateEvent);
router.delete('/event/:id', deleteEvent);

// Routes pour le CRUD des types de produit
router.get('/productType', getProductType);
router.get('/productType/:id', getProductTypeById);
router.post('/productType', addProductType);
router.put('/productType/:id', updateProductType);
router.delete('/productType/:id', deleteProductType);

// Routes pour le CRUD des produits
router.get('/product', getProduct);
router.get('/product/:id', getProductById);
router.post('/product', addProduct);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);

// Routes pour le CRUD des inscriptions
router.get('/inscription', getInscription);
router.get('/inscription/:id', getInscriptionById);
router.post('/inscription', addInscription);
router.put('/inscription/:id', updateInscription);
router.delete('/inscription/:id', deleteInscription);

// Routes pour le CRUD des conversations
router.get('/conversation', getConversation);
router.get('/conversation/event/:id', getConversationByEvent);
router.get('/conversation/:id', getConversationById);
router.post('/conversation', addConversation);
router.put('/conversation/:id', updateConversation);
router.delete('/conversation/:id', deleteConversation);

// Routes pour le CRUD des messages
router.get('/message', getMessage);
router.get('/message/:id', getMessageById);
router.post('/message', addMessage);
router.put('/message/:id', updateMessage);
router.delete('/message/:id', deleteMessage);

// Routes pour le CRUD des infoBanners
router.get('/infoBanner', getInfoBanner);
router.get('/infoBanner/:id', getInfoBannerById);
router.post('/infoBanner', addInfoBanner);
router.put('/infoBanner/:id', updateInfoBanner);
router.delete('/infoBanner/:id', deleteInfoBanner);

// Routes pour le CRUD des équipes de match
router.get('/matchTeam', getMatchTeam);
router.get('/matchTeam/:id', getMatchTeamById);
router.post('/matchTeam', addMatchTeam);
router.put('/matchTeam/:id', updateMatchTeam);
router.delete('/matchTeam/:id', deleteMatchTeam);

// Routes pour le CRUD des scores de match
router.get('/matchScore', getMatchScore);
router.get('/matchScore/:id', getMatchScoreById);
router.post('/matchScore', addMatchScore);
router.put('/matchScore/:id', updateMatchScore);
router.delete('/matchScore/:id', deleteMatchScore);

// Routes pour le CRUD des équipes
router.get('/team', getTeam);
router.get('/team/:id', getTeamById);
router.post('/team', addTeam);
router.put('/team/:id', updateTeam);
router.delete('/team/:id', deleteTeam);

// Routes pour le CRUD des membres d'équipe
router.get('/teamMember', getTeamMember);
router.get('/teamMember/:id', getTeamMemberById);
router.post('/teamMember', addTeamMember);
router.put('/teamMember/:id', updateTeamMember);
router.delete('/teamMember/:id', deleteTeamMember);

// Routes pour le CRUD des demandes d'adhésion
router.get('/requestToJoin', getRequestToJoin);
router.get('/requestToJoin/:id', getRequestToJoinById);
router.post('/requestToJoin', addRequestToJoin);
router.put('/requestToJoin/:id', updateRequestToJoin);
router.delete('/requestToJoin/:id', deleteRequestToJoin);

// Routes pour le CRUD des formulaire d'adhésion
router.get('/membershipForm', getMembershipForm);
router.get('/membershipForm/:id', getMembershipFormById);
router.post('/membershipForm', addMembershipForm);
router.put('/membershipForm/:id', updateMembershipForm);
router.delete('/membershipForm/:id', deleteMembershipForm);

// Routes pour générer une image 
// router.get('/generateImage', getGenerateImage);

// Routes pour générer une réponse
// router.get('/generateResponse', authenticateToken, getGenerateResponse);

// Routes pour le CRUD des photos
router.get('/photos', getPhotos);
router.get('/photo/:id', getPhoto);
router.post('/photo', upload, addPhoto);
router.delete('/photo/:id', deletePhoto);

// Routes pour l'envoi d'emails
// router.post('/register', register);
router.post('/emailTest/register', register);
router.post('/emailTest/requestPasswordReset', requestPasswordReset);

// Routes génériques
router.get('/:table', getEntries);
router.get('/:table/:id', getEntryById);
router.post('/:table', addEntry);
router.put('/:table/:id', updateEntry);
router.delete('/:table/:id', deleteEntry);

// Routes pour le CRUD des cartes de crédit
router.get('/creditCard', getCreditCards);
router.get('/creditCard/:id', getCreditCardById);
router.post('/creditCard', addCreditCard);
router.put('/creditCard/:id', updateCreditCard);
router.delete('/creditCard/:id', deleteCreditCard);

module.exports = router;