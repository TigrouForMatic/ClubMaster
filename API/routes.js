const express = require('express');
const router = express.Router();
const { getEntries, getEntryById, addEntry, updateEntry, deleteEntry } = require('./controllers');

router.get('/:table', getEntries);
router.get('/:table/:id', getEntryById);
router.post('/:table', addEntry);
router.put('/:table/:id', updateEntry);
router.delete('/:table/:id', deleteEntry);

module.exports = router;