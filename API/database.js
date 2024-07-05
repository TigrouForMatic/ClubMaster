const { Pool } = require('pg');

const pool = new Pool({
    user: 'docker',
    host: 'db',
    database: 'docker',
    password: 'docker',
    port: 5432,
});

const setupDatabase = async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log('Connexion à la base de données établie avec succès');
    } catch (err) {
        console.error('Erreur lors de la connexion à la base de données:', err);
    }
};

module.exports = { pool, setupDatabase };