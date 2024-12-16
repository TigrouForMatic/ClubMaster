const { pool } = require('../../database');

const TABLE_NAME = 'db.TeamMember';

const getTeamMember = async (req, res) => {
    const { arrayTeamId } = req.query;
    try {
        const values = [];

        let queryString = `
            SELECT 
                db.TeamMember.*,
                db.PersonPhysic.Name,
                db.Login.Pseudo
            FROM ${TABLE_NAME}
            JOIN db.PersonPhysic ON db.TeamMember.PersonPhysicId = db.PersonPhysic.Id
            JOIN db.Login ON db.PersonPhysic.LoginId = db.Login.Id
        `;
        
        if (arrayTeamId && Array.isArray(JSON.parse(arrayTeamId))) {
            const teamId = JSON.parse(arrayTeamId);
            queryString += ` WHERE teamid = ANY($1) AND db.TeamMember.Bin = false`;
            values.push(teamId);
        } else {
            queryString += ` WHERE db.TeamMember.Bin = false`;
        }

        const client = await pool.connect();
        const result = await client.query(queryString, values);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des membres d\'équipe', err);
        res.status(500).send('Erreur lors de la récupération des membres d\'équipe');
    }
};

const getTeamMemberById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1 AND Bin = false`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Membre d\'équipe non trouvé');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération du membre d'équipe avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération du membre d'équipe avec l'ID ${id}`);
    }
};

const addTeamMember = async (req, res) => {
    const currentDate = new Date();
    
    if (!req.user) return res.sendStatus(401);

    
    const { columns, values } = prepareInsertData(req.body);

    try {
        const client = await pool.connect();

        const columnsWithDates = `${columns}, Dc, Dm, Bin`;
        const valuesWithDates = [...values, currentDate, currentDate, false];

        const insertQuery = `INSERT INTO ${TABLE_NAME} (${columnsWithDates}) VALUES (${valuesWithDates.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`;

        const result = await client.query(insertQuery, valuesWithDates);
        client.release();

        // Récupérer les données insérées
        const insertedEvent = result.rows[0];

        // Effectuer une nouvelle requête pour obtenir toutes les données de l'événement
        const selectQuery = `SELECT * FROM ${TABLE_NAME} WHERE id = $1`;
        const selectResult = await client.query(selectQuery, [insertedEvent.id]);
        
        res.status(201).json(selectResult.rows[0]);
    } catch (err) {
        console.error('Erreur lors de l\'ajout d\'un nouveau membre d\'équipe', err);
        res.status(500).send('Erreur lors de l\'ajout d\'un nouveau membre d\'équipe');
    }
};

const updateTeamMember = async (req, res) => {

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
            return res.status(404).send('Membre d\'équipe non trouvé');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour du membre d'équipe avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour du membre d'équipe avec l'ID ${id}`);
    }
};

const deleteTeamMember = async (req, res) => {

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`UPDATE ${TABLE_NAME} SET Bin = true WHERE id = $1 RETURNING *`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Membre d\'équipe non trouvé');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression du membre d'équipe avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression du membre d'équipe avec l'ID ${id}`);
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
    getTeamMember,
    getTeamMemberById,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember
};