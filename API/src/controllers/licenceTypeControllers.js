const { pool } = require('../../database');

const TABLE_NAME = 'db.LicenceType';

const getLicenceType = async (req, res) => {
    const filters = req.query;

    try {
        let queryString = `SELECT * FROM ${TABLE_NAME}`;
        const values = [];
        
        if (Object.keys(filters).length > 0) {
            const filterConditions = Object.entries(filters).map(([key, value], index) => {
                values.push(value);
                return `${key} = $${index + 1}`;
            });
            queryString += ' AND ' + filterConditions.join(' AND ');
        }

        const client = await pool.connect();
        const result = await client.query(queryString, values);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des types de licence', err);
        res.status(500).send('Erreur lors de la récupération des types de licence');
    }
};

const getLicenceTypeById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Type de licence non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération du type de licence avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération du type de licence avec l'ID ${id}`);
    }
};

const addLicenceType = async (req, res) => {

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
        console.error('Erreur lors de l\'ajout d\'un type de licence', err);
        res.status(500).send('Erreur lors de l\'ajout d\'un type de licence');
    }
};

const addLicenceTypeFromNewClub = async (req, res) => {

    const { clubId } = req.params;

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    try {
        const client = await pool.connect();
        const insertQuery =  `INSERT INTO ${TABLE_NAME} (Label, ClubId, Price) VALUES ('Licence Adulte', ${clubId}, null) RETURNING *`;
        const result = await client.query(insertQuery);
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erreur lors de l\'ajout de type de licences lors de la création d\'un club', err);
        res.status(500).send('Erreur lors de l\'ajout de type de licences lors de la création d\'un club');
    }
};

const updateLicenceType = async (req, res) => {

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
            return res.status(404).send('Type de licence non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour du type de licence avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour du type de licence avec l'ID ${id}`);
    }
};

const deleteLicenceType = async (req, res) => {

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`DELETE FROM ${TABLE_NAME} WHERE id = $1 RETURNING *`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Type de licence non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression du type de licences avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression du type de licence avec l'ID ${id}`);
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
    getLicenceType,
    getLicenceTypeById,
    addLicenceType,
    addLicenceTypeFromNewClub,
    updateLicenceType,
    deleteLicenceType
};