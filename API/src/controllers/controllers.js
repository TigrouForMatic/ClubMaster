const { pool } = require('../../database');

const getEntries = async (req, res) => {
    const table = req.params.table;
    const filters = req.query;

    try {
        const client = await pool.connect();
        let queryString = `SELECT * FROM db.${table}`;
        const values = [];
        
        if (Object.keys(filters).length > 0) {
            queryString += ' WHERE ' + Object.keys(filters).map((key, index) => `${key} = $${index + 1}`).join(' AND ');
            values.push(...Object.values(filters));
        }

        const result = await client.query(queryString, values);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error(`Erreur lors de la récupération des entrées de la table ${table}`, err);
        res.status(500).send(`Erreur lors de la récupération des entrées de la table ${table}`);
    }
};

const getEntryById = async (req, res) => {
    const { table, id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM db.${table} WHERE id = $1`, [id]);
        client.release();
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération de l'entrée de la table ${table} avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération de l'entrée de la table ${table} avec l'ID ${id}`);
    }
};

const addEntry = async (req, res) => {
    const table = req.params.table;
    const { columns, values } = prepareInsertData(req.body);

    try {
        const client = await pool.connect();
        const insertQuery = `INSERT INTO db.${table} (${columns}) VALUES (${values.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`;
        const result = await client.query(insertQuery, values);
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de l'ajout d'une nouvelle entrée dans la table ${table}`, err);
        res.status(500).send(`Erreur lors de l'ajout d'une nouvelle entrée dans la table ${table}`);
    }
};

const updateEntry = async (req, res) => {
    const { table, id } = req.params;
    const { updates, values } = prepareUpdateData(req.body);

    try {
        const client = await pool.connect();
        const updateQuery = `UPDATE db.${table} SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
        const result = await client.query(updateQuery, [...values, id]);
        client.release();
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour de l'entrée dans la table ${table} avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour de l'entrée dans la table ${table} avec l'ID ${id}`);
    }
};

const deleteEntry = async (req, res) => {
    const { table, id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`DELETE FROM db.${table} WHERE id = $1 RETURNING *`, [id]);
        client.release();
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression de l'entrée dans la table ${table} avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression de l'entrée dans la table ${table} avec l'ID ${id}`);
    }
};

const prepareInsertData = (body) => {
    const columns = Object.keys(body).join(', ');
    const values = Object.values(body);
    return { columns, values };
};

const prepareUpdateData = (body) => {
    const updates = Object.keys(body).map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = Object.values(body);
    return { updates, values };
};

module.exports = {
    getEntries,
    getEntryById,
    addEntry,
    updateEntry,
    deleteEntry
};