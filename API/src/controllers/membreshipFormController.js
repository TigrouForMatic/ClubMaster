const { pool } = require('../../database');

const TABLE_NAME = 'db.MembershipForm';

const getMembershipForm = async (req, res) => {
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
        console.error('Erreur lors de la récupération des formulaire d\'adhésion', err);
        res.status(500).send('Erreur lors de la récupération des formulaire d\'adhésion');
    }
};

const getMembershipFormById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Formulaire d\'adhésion non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération du formulaire d'adhésion avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération du formulaire d'adhésion avec l'ID ${id}`);
    }
};

const addMembershipForm = async (req, res) => {
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
        console.error('Erreur lors de l\'ajout d\'un nouveau formulaire d\'adhésion', err);
        res.status(500).send('Erreur lors de l\'ajout d\'un nouveau formulaire d\'adhésion');
    }
};

const updateMembershipForm = async (req, res) => {
    const { id } = req.params;
    const { updates, values } = prepareUpdateData(req.body);

    try {
        const client = await pool.connect();
        const updateQuery = `UPDATE ${TABLE_NAME} SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
        const result = await client.query(updateQuery, [...values, id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Formulaire d\'adhésion non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour du formulaire d'adhésion avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour du formulaire d'adhésion avec l'ID ${id}`);
    }
};

const deleteMembershipForm = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`UPDATE ${TABLE_NAME} SET Bin = true WHERE id = $1 RETURNING *`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Formulaire d\'adhésion non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression du formulaire d'adhésion avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression du formulaire d'adhésion avec l'ID ${id}`);
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
    getMembershipForm,
    getMembershipFormById,
    addMembershipForm,
    updateMembershipForm,
    deleteMembershipForm
};