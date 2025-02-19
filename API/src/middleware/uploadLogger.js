const express = require('express');
const path = require('path');

const uploadLogger = express.static(path.join(__dirname, '../../uploads'), {
    setHeaders: (res, path, stat) => {
        console.log('Tentative d\'accès au fichier:', path);
        res.set('Access-Control-Allow-Origin', '*');
    }
});

module.exports = uploadLogger;