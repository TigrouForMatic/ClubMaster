// routes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { createAccount, testLogin } = require('../controllers/authControllers');
const genericController = require('../controllers/genericController');

const addressController = genericController('Address');
const personPhysicController = genericController('PersonPhysic');

// Auth routes
router.post('/auth/create-account', createAccount);
router.post('/auth/login', testLogin);

// Address routes
router.get('/address', addressController.getAll);
router.get('/address/:id', addressController.getById);
router.post('/address', authenticateToken, addressController.create);
router.put('/address/:id', authenticateToken, addressController.update);
router.delete('/address/:id', authenticateToken, addressController.delete);

// PersonPhysic routes
router.get('/personPhysic', personPhysicController.getAll);
router.get('/personPhysic/:id', personPhysicController.getById);
router.post('/personPhysic', authenticateToken, personPhysicController.create);
router.put('/personPhysic/:id', authenticateToken, personPhysicController.update);
router.delete('/personPhysic/:id', authenticateToken, personPhysicController.delete);

// Generic routes
router.get('/:table', (req, res) => genericController(req.params.table).getAll(req, res));
router.get('/:table/:id', (req, res) => genericController(req.params.table).getById(req, res));
router.post('/:table', authenticateToken, (req, res) => genericController(req.params.table).create(req, res));
router.put('/:table/:id', authenticateToken, (req, res) => genericController(req.params.table).update(req, res));
router.delete('/:table/:id', authenticateToken, (req, res) => genericController(req.params.table).delete(req, res));

module.exports = router;