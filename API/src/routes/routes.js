const express = require('express');
const router = express.Router();
const { getEntries, getEntryById, addEntry, updateEntry, deleteEntry } = require('../controllers/controllers');
const { createAccount, testLogin } = require('../controllers/authControllers');


// Nouvelles routes pour l'authentification
router.post('/auth/create-account', createAccount);
router.post('/auth/login', testLogin);

router.get('/:table', getEntries);
router.get('/:table/:id', getEntryById);
router.post('/:table', addEntry);
router.put('/:table/:id', updateEntry);
router.delete('/:table/:id', deleteEntry);

module.exports = router;