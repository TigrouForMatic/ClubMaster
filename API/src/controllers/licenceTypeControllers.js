const { pool } = require('../../database');

const TABLE_NAME = 'db.LicenceType';

const getLicenceType = async (req, res) => {
    const { arrayClubId } = req.query;
    try {
        let queryString = `SELECT * FROM ${TABLE_NAME}`;
        const values = [];
        
        if (arrayClubId && Array.isArray(JSON.parse(arrayClubId))) {
            const clubIds = JSON.parse(arrayClubId);
            queryString += ` WHERE clubid = ANY($1) AND Bin = false`;
            values.push(clubIds);
        } else {
            queryString += ` WHERE Bin = false`;
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
    const currentDate = new Date();    
    try {
        const client = await pool.connect();
        const columnsWithDates = `${columns}, Dc, Dm, Bin`;
        const valuesWithDates = [...values, currentDate, currentDate, false];
    
        const insertQuery = `INSERT INTO ${TABLE_NAME} (${columnsWithDates}) VALUES (${valuesWithDates.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`;
    
        const result = await client.query(insertQuery, valuesWithDates);
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
    const currentDate = new Date();
    try {
        const client = await pool.connect();
        const columnsWithDates = `${updates}, Dm = $${values.length + 1}`;
        const valuesWithDates = [...values, currentDate];

        const updateQuery = `UPDATE ${TABLE_NAME} SET ${columnsWithDates} WHERE id = $${valuesWithDates.length + 1} RETURNING *`;
        const result = await client.query(updateQuery, [...valuesWithDates, id]);
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
    const currentDate = new Date();
    try {
        const client = await pool.connect();
        const result = await client.query(`UPDATE ${TABLE_NAME} SET Dm = $1, Bin = true WHERE id = $2 RETURNING *`, [currentDate, id]);
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