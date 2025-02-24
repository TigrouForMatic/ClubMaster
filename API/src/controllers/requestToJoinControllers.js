const { pool } = require('../../database');

const TABLE_NAME = 'db.RequestToJoin';

const getRequestToJoin = async (req, res) => {
    const { arrayClubId, userId } = req.query;
    try {
        let queryString = `
            SELECT r.*, p.Name as PersonName,p.EmailAddress as PersonEmailAddress,p.PhoneNumber as PersonPhoneNumber, c.Label as ClubLabel
            FROM ${TABLE_NAME} r
            LEFT JOIN db.PersonPhysic p ON r.PersonPhysicId = p.Id
            LEFT JOIN db.Club c ON r.ClubId = c.Id
            WHERE r.Bin = false`;
        const values = [];
        let paramCount = 1;

        if (userId && arrayClubId && Array.isArray(JSON.parse(arrayClubId))) {
            const clubIds = JSON.parse(arrayClubId);
            queryString += ` AND r.PersonPhysicId = $${paramCount} AND r.ClubId = ANY($${paramCount + 1})`;
            values.push(userId, clubIds);
        } else if (arrayClubId && Array.isArray(JSON.parse(arrayClubId))) {
            const clubIds = JSON.parse(arrayClubId);
            queryString += ` AND r.ClubId = ANY($${paramCount})`;
            values.push(clubIds);
        } else if (userId) {
            queryString += ` AND r.PersonPhysicId = $${paramCount}`;
            values.push(userId);
        }

        const client = await pool.connect();
        const result = await client.query(queryString, values);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des demandes d\'adhésion', err);
        res.status(500).send('Erreur lors de la récupération des demandes d\'adhésion');
    }
};

const getRequestToJoinById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Demande d\'adhésion non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération de la demande d'adhésion avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération de la demande d'adhésion avec l'ID ${id}`);
    }
};

const addRequestToJoin = async (req, res) => {
    const currentDate = new Date();

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
        console.error('Erreur lors de l\'ajout d\'une demande d\'adhésion', err);
        res.status(500).send('Erreur lors de l\'ajout d\'une demande d\'adhésion');
    }
};

const updateRequestToJoin = async (req, res) => {
    const { id } = req.params;
    const { updates, values } = prepareUpdateData(req.body);

    try {
        const client = await pool.connect();
        const updateQuery = `UPDATE ${TABLE_NAME} SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
        const result = await client.query(updateQuery, [...values, id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Demande d\'adhésion non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour de la demande d'adhésion avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour de la demande d'adhésion avec l'ID ${id}`);
    }
};

const deleteRequestToJoin = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`UPDATE ${TABLE_NAME} SET Bin = true WHERE id = $1 RETURNING *`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Demande d\'adhésion non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression de la demande d'adhésion avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression de la demande d'adhésion avec l'ID ${id}`);
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
    getRequestToJoin,
    getRequestToJoinById,
    addRequestToJoin,
    updateRequestToJoin,
    deleteRequestToJoin
};