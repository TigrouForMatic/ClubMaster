const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
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