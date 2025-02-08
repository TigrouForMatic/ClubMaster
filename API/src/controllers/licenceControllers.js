const { pool } = require('../../database');

const TABLE_NAME = 'db.Licence';

const getLicence = async (req, res) => {
    const filters = req.query;

    try {
        let queryString = `SELECT * FROM ${TABLE_NAME} WHERE Bin = false`;
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
        console.error('Erreur lors de la récupération des licences', err);
        res.status(500).send('Erreur lors de la récupération des licences');
    }
};

const getLicenceManage = async (req, res) => {
    if (!req.user) return res.sendStatus(401);

    try {
        const { arrayClubId } = req.query;

        let queryString = `
            SELECT l.*, pp.Name, pp.NaissanceDate, pp.PhoneNumber, pp.EmailAddress, lt.Label AS TypeLabel
            FROM db.Licence l
            JOIN db.PersonPhysic pp ON l.PersonPhysicId = pp.Id
            JOIN db.LicenceType lt ON l.LicenceTypeId = lt.Id
        `;
        const values = [];

        let parsedArrayClubId;
        if (arrayClubId) {
            try {
                parsedArrayClubId = typeof arrayClubId === 'string' ? JSON.parse(arrayClubId) : arrayClubId;
            } catch (parseError) {
                console.error('Erreur lors du parsing de arrayClubId:', parseError);
                return res.status(400).send('Format de arrayClubId invalide');
            }

            if (Array.isArray(parsedArrayClubId) && parsedArrayClubId.length > 0) {
                queryString += ` WHERE lt.clubid = ANY($1)`;
                values.push(parsedArrayClubId);
            }
        }

        const client = await pool.connect();
        const result = await client.query(queryString, values);
        client.release();

        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des licences', err);
        res.status(500).send('Erreur lors de la récupération des licences');
    }
};

const getLicenceById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1 AND Bin = false`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Licence non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération de la licences avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération de la licence avec l'ID ${id}`);
    }
};

const addLicence = async (req, res) => {
    const currentDate = new Date();

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const { columns, values } = prepareInsertData(req.body);

    try {
        const client = await pool.connect();

        const columnsWithDates = `${columns}, Dc, Dm, Bin`;
        const valuesWithDates = [...values, currentDate, currentDate, false];

        const insertQuery = `INSERT INTO ${TABLE_NAME} (${columnsWithDates}) VALUES (${valuesWithDates.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`;

        const result = await client.query(insertQuery, valuesWithDates);

        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erreur lors de l\'ajout d\'une nouvelle licence', err);
        res.status(500).send('Erreur lors de l\'ajout d\'une nouvelle licence');
    }
};

const updateLicence = async (req, res) => {

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
            return res.status(404).send('Licence non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour de la licence avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour de la licence avec l'ID ${id}`);
    }
};

const deleteLicence = async (req, res) => {

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const { id } = req.params;
    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    try {
        const client = await pool.connect();
        const updateQuery = `UPDATE ${TABLE_NAME} SET Bin = true WHERE id = $1 RETURNING *`;
        const result = await client.query(updateQuery, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Licence non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour de la licence avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour de la licence avec l'ID ${id}`);
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
    getLicence,
    getLicenceManage,
    getLicenceById,
    addLicence,
    updateLicence,
    deleteLicence
};