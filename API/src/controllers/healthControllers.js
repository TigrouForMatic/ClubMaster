const { pool } = require('../../database');

const healthCheck = async (req, res) => {
    try {
        // Test simple de connexion à la base de données
        await pool.query('SELECT 1');
        res.status(200).json({ 
            status: 'ok',
            message: 'Service opérationnel',
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Erreur lors du health check:', err);
        res.status(500).json({ 
            status: 'error',
            message: 'Service indisponible',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = {
    healthCheck
};