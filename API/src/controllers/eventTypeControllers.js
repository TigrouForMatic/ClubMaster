const { pool } = require('../../database');

const TABLE_NAME = 'db.EventType';

const getEventType = async (req, res) => {
    const { arrayClubId } = req.query;
    try {
        let queryString = `SELECT * FROM ${TABLE_NAME}`;
        const values = [];
        
        if (arrayClubId && Array.isArray(JSON.parse(arrayClubId))) {
            const clubIds = JSON.parse(arrayClubId);
            queryString += ` WHERE clubid = ANY($1)`;
            values.push(clubIds);
        }

        const client = await pool.connect();
        const result = await client.query(queryString, values);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des types d\'événements', err);
        res.status(500).send('Erreur lors de la récupération des types d\'événements');
    }
};

const getEventTypeById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Role non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération du roles avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération du role avec l'ID ${id}`);
    }
};

const addEventType = async (req, res) => {

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const { columns, values } = prepareInsertData(req.body);

    try {
        const client = await pool.connect();
        const insertQuery = `INSERT INTO ${TABLE_NAME} (${columns}) VALUES (${values.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`;
        const result = await client.query(insertQuery, values);
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erreur lors de l\'ajout d\'un nouveau role', err);
        res.status(500).send('Erreur lors de l\'ajout d\'un nouveau role');
    }
};

const updateEventType = async (req, res) => {

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const { id } = req.params;
    const { updates, values } = prepareUpdateData(req.body);

    try {
        const client = await pool.connect();
        const updateQuery = `UPDATE ${TABLE_NAME} SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
        const result = await client.query(updateQuery, [...values, id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Role non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour du role avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour du role avec l'ID ${id}`);
    }
};

const deleteEventType = async (req, res) => {

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`DELETE FROM ${TABLE_NAME} WHERE id = $1 RETURNING *`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Role non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression du role avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression du role avec l'ID ${id}`);
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
    getEventType,
    getEventTypeById,
    addEventType,
    updateEventType,
    deleteEventType
};