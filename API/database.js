const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

const setupDatabase = async () => {
    const maxRetries = 5;
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            await pool.query('SELECT NOW()');
            console.log('Connexion à la base de données établie avec succès');
            return;
        } catch (err) {
            retries++;
            console.log(`Tentative ${retries}/${maxRetries} échouée`);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    console.error('Impossible de se connecter à la base de données après plusieurs tentatives');
};

module.exports = { pool, setupDatabase };