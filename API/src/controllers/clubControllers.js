const { pool } = require('../../database');

const TABLE_NAME = 'db.Club';

const getClub = async (req, res) => {
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
        console.error('Erreur lors de la récupération des adresses', err);
        res.status(500).send('Erreur lors de la récupération des adresses');
    }
};

const getClubByPerson = async (req, res) => {
    const { idPersonnel } = req.params;

    console.log(idPersonnel)

    try {
        const queryString = `
            SELECT DISTINCT c.*, l.Dd AS DateDebut, l.Df AS DateFin, r.Label AS RoleLabel
            FROM db.Licence l
            JOIN db.Role r ON l.RoleId = r.Id
            JOIN db.Club c ON r.ClubId = c.Id
            WHERE l.PersonPhysicId = $1
            ORDER BY l.Dd DESC
        `;

        const client = await pool.connect();
        try {
            const result = await client.query(queryString, [idPersonnel]);
            res.json(result.rows);
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Erreur lors de la récupération des clubs', err);
        res.status(500).send('Erreur lors de la récupération des clubs');
    }
};

const getClubById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Adresse non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération de l'adresse avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération de l'adresse avec l'ID ${id}`);
    }
};

const addClub = async (req, res) => {

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
        console.error('Erreur lors de l\'ajout d\'une nouvelle adresse', err);
        res.status(500).send('Erreur lors de l\'ajout d\'une nouvelle adresse');
    }
};

const updateClub = async (req, res) => {

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
            return res.status(404).send('Adresse non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour de l'adresse avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour de l'adresse avec l'ID ${id}`);
    }
};

const deleteClub = async (req, res) => {

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`DELETE FROM ${TABLE_NAME} WHERE id = $1 RETURNING *`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Adresse non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression de l'adresse avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression de l'adresse avec l'ID ${id}`);
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
    getClub,
    getClubByPerson,
    getClubById,
    addClub,
    updateClub,
    deleteClub
};