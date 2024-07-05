const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3200;

app.use(cors());
app.use(bodyParser.json());

// Configuration de la connexion à la base de données
const pool = new Pool({
    user: 'docker',
    host: 'db',
    database: 'docker',
    password: 'docker',
    port: 5432,
});

// // Endpoint pour récupérer toutes les entrées d'une table
// app.get('/address', async (req, res) => {
//     const table = req.params.table;
//     try {
//         const client = await pool.connect();
//         const result = await client.query(`SELECT * FROM db.Address WHERE Private LIKE "false" AND Validate LIKE "true"`);
//         client.release();
//         res.json(result.rows);
//     } catch (err) {
//         console.error(`Erreur lors de la récupération des entrées de la table ${table}`, err);
//         res.status(500).send(`Erreur lors de la récupération des entrées de la table ${table}`);
//     }
// });

// Endpoint pour récupérer les entrées d'une table en fonction de critères
app.get('/:table', async (req, res) => {
    const table = req.params.table;
    const filters = req.query; // Les filtres sont dans req.query

    try {
        const client = await pool.connect();

        // Construction de la requête dynamique en fonction des filtres
        let queryString = `SELECT * FROM db.${table}`;
        if (Object.keys(filters).length > 0) {
            queryString += ' WHERE';
            let isFirstFilter = true;
            for (const key in filters) {
                if (!isFirstFilter) {
                    queryString += ' AND';
                }
                queryString += ` ${key} = '${filters[key]}'`;
                isFirstFilter = false;
            }
        }

        const result = await client.query(queryString);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error(`Erreur lors de la récupération des entrées de la table ${table}`, err);
        res.status(500).send(`Erreur lors de la récupération des entrées de la table ${table}`);
    }
});

// Endpoint pour récupérer une entrée par ID
app.get('/:table/:id', async (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM db.${table} WHERE id = $1`, [id]);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error(`Erreur lors de la récupération de l'entrée de la table ${table} avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération de l'entrée de la table ${table} avec l'ID ${id}`);
    }
});

// Endpoint pour ajouter une nouvelle entrée
app.post('/:table', async (req, res) => {
    const table = req.params.table;
    const columns = Object.keys(req.body).join(', ');
    const values = Object.values(req.body);
    const valuePlaceholders = values.map((_, index) => `$${index + 1}`).join(', ');

    try {
        const client = await pool.connect();
        const insertQuery = `INSERT INTO db.${table} (${columns}) VALUES (${valuePlaceholders}) RETURNING *`;
        const result = await client.query(insertQuery, values);
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de l'ajout d'une nouvelle entrée dans la table ${table}`, err);
        res.status(500).send(`Erreur lors de l'ajout d'une nouvelle entrée dans la table ${table}`);
    }
});

// Endpoint pour modifier une entrée existante
app.put('/:table/:id', async (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    const updates = Object.keys(req.body).map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = [...Object.values(req.body), id];

    try {
        const client = await pool.connect();
        const updateQuery = `UPDATE db.${table} SET ${updates} WHERE id = $${values.length} RETURNING *`;
        const result = await client.query(updateQuery, values);
        client.release();
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour de l'entrée dans la table ${table} avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour de l'entrée dans la table ${table} avec l'ID ${id}`);
    }
});

// Endpoint pour supprimer une entrée par ID
app.delete('/:table/:id', async (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    try {
        const client = await pool.connect();
        const result = await client.query(`DELETE FROM db.${table} WHERE id = $1 RETURNING *`, [id]);
        client.release();
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression de l'entrée dans la table ${table} avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression de l'entrée dans la table ${table} avec l'ID ${id}`);
    }
});

// Endpoint de test
app.get('/test', (req, res) => {
    res.json("Ici ça teste");
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
