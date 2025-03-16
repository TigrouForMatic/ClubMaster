const { pool } = require('../../database');

const TABLE_NAME = 'db.MatchTeam';

const getMatchTeam = async (req, res) => {
    const { arrayEventId } = req.query;
    try {
        let queryString = `
            SELECT 
                db.MatchTeam.Id,
                db.MatchTeam.EventId,
                db.Team.Id as teamId,
                db.Team.Label,
                db.Team.Public,
                db.Team.Dc,
                db.Team.Dm,
                db.Team.Bin,
                json_agg(
                    CASE WHEN db.TeamMember.Id IS NOT NULL THEN
                        json_build_object(
                            'memberId', db.TeamMember.Id,
                            'firstName', lo.FirstName,
                            'lastName', lo.LastName,
                            'pseudo', lo.Pseudo
                        )
                    ELSE NULL END
                ) FILTER (WHERE db.TeamMember.Id IS NOT NULL) as members
            FROM db.MatchTeam
            LEFT JOIN db.Team ON db.MatchTeam.TeamId = db.Team.Id
            LEFT JOIN db.TeamMember ON db.Team.Id = db.TeamMember.TeamId AND db.TeamMember.Bin = false
            LEFT JOIN db.Login lo ON db.TeamMember.LoginId = lo.Id
            WHERE db.MatchTeam.Bin = false
        `;

        const values = [];
        
        if (arrayEventId && Array.isArray(JSON.parse(arrayEventId))) {
            const eventId = JSON.parse(arrayEventId);
            queryString += ` AND db.MatchTeam.eventid = ANY($1)`;
            values.push(eventId);
        }

        queryString += ` GROUP BY db.MatchTeam.Id, db.MatchTeam.EventId, db.Team.Id, db.Team.Label, db.Team.Public, db.Team.Dc, db.Team.Dm, db.Team.Bin, db.Team.Bin`;

        const client = await pool.connect();
        const result = await client.query(queryString, values);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des équipes de match', err);
        res.status(500).send('Erreur lors de la récupération des équipes de match');
    }
};

const getMatchTeamById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1 AND Bin = false`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Équipe de match non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération de l'équipe de match avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération de l'équipe de match avec l'ID ${id}`);
    }
};

const addMatchTeam = async (req, res) => {
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
        console.error('Erreur lors de l\'ajout d\'une nouvelle équipe de match', err);
        res.status(500).send('Erreur lors de l\'ajout d\'une nouvelle équipe de match');
    }
};

const updateMatchTeam = async (req, res) => {

    

    const { id } = req.params;
    const { updates, values } = prepareUpdateData(req.body);

    try {
        const client = await pool.connect();
        const updateQuery = `UPDATE ${TABLE_NAME} SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
        const result = await client.query(updateQuery, [...values, id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Équipe de match non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour de l'équipe de match avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour de l'équipe de match avec l'ID ${id}`);
    }
};

const deleteMatchTeam = async (req, res) => {

    

    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`UPDATE ${TABLE_NAME} SET Bin = true WHERE id = $1 RETURNING *`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Équipe de match non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression de l'équipe de match avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression de l'équipe de match avec l'ID ${id}`);
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
    getMatchTeam,
    getMatchTeamById,
    addMatchTeam,
    updateMatchTeam,
    deleteMatchTeam
};