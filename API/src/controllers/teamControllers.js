const { pool } = require('../../database');

const TABLE_NAME = 'db.Team';

const getTeam = async (req, res) => {
    const { arrayClubId } = req.query;
    try {
        let queryString = `
            SELECT 
                db.Team.*,
                json_agg(
                    json_build_object(
                        'memberId', db.TeamMember.Id,
                        'name', db.PersonPhysic.Name,
                        'pseudo', db.Login.Pseudo
                    )
                ) as members
            FROM ${TABLE_NAME}
            LEFT JOIN db.TeamMember ON db.Team.Id = db.TeamMember.TeamId
            LEFT JOIN db.PersonPhysic ON db.TeamMember.PersonPhysicId = db.PersonPhysic.Id
            LEFT JOIN db.Login ON db.PersonPhysic.LoginId = db.Login.Id
            WHERE db.TeamMember.Bin = false AND db.Team.Public = true
        `;

        const values = [];
        
        if (arrayClubId && Array.isArray(JSON.parse(arrayClubId))) {
            const clubId = JSON.parse(arrayClubId);
            queryString += ` AND db.Team.ClubId = ANY($1)`;
            values.push(clubId);
        }

        queryString += ` GROUP BY db.Team.Id`;

        const client = await pool.connect();
        const result = await client.query(queryString, values);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des équipes', err);
        res.status(500).send('Erreur lors de la récupération des équipes');
    }
};

const getTeamById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1 AND Bin = false`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Équipe non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération de l'équipe avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération de l'équipe avec l'ID ${id}`);
    }
};

const addTeam = async (req, res) => {
    const currentDate = new Date();
    
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
        console.error('Erreur lors de l\'ajout d\'une nouvelle équipe', err);
        res.status(500).send('Erreur lors de l\'ajout d\'une nouvelle équipe');
    }
};

const updateTeam = async (req, res) => {

    const { id } = req.params;
    const { updates, values } = prepareUpdateData(req.body);

    try {
        const client = await pool.connect();
        const updateQuery = `UPDATE ${TABLE_NAME} SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
        const result = await client.query(updateQuery, [...values, id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Équipe non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour de l'équipe avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour de l'équipe avec l'ID ${id}`);
    }
};

const deleteTeam = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`UPDATE ${TABLE_NAME} SET Bin = true WHERE id = $1 RETURNING *`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Équipe non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression de l'équipe avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression de l'équipe avec l'ID ${id}`);
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
    getTeam,
    getTeamById,
    addTeam,
    updateTeam,
    deleteTeam
};