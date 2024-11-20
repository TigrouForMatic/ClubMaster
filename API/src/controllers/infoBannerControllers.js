const { pool } = require('../../database');

const TABLE_NAME = 'db.InfoBanner';

const getInfoBanner = async (req, res) => {
    const { arrayClubId } = req.query;
    try {
        let queryString = `SELECT * FROM ${TABLE_NAME}`;
        const values = [];
        
        queryString = `SELECT i.*, p.Name as CreatedByName 
                      FROM ${TABLE_NAME} i
                      LEFT JOIN db.PersonPhysic p ON i.CreatedBy = p.id`;
        
        queryString += ` WHERE i.Bin = false AND i.Dd <= CURRENT_DATE AND i.Df >= CURRENT_DATE`;
        
        if (arrayClubId) {
            try {
                const clubIds = JSON.parse(arrayClubId);
                if (Array.isArray(clubIds)) {
                    queryString += ` AND i.clubid = ANY($1)`;
                    values.push(clubIds);
                }
            } catch {
                console.log('Format de clubId invalide');
            }
        }

        const client = await pool.connect();
        const result = await client.query(queryString, values);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des infoBanners', err);
        res.status(500).send('Erreur lors de la récupération des infoBanners');
    }
};

const getInfoBannerById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1 AND Bin = false`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('InfoBanner non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération du infoBanner avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération du infoBanner avec l'ID ${id}`);
    }
};

const addInfoBanner = async (req, res) => {
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
        console.error('Erreur lors de l\'ajout d\'un nouveau infoBanner', err);
        res.status(500).send('Erreur lors de l\'ajout d\'un nouveau infoBanner');
    }
};

const updateInfoBanner = async (req, res) => {

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
            return res.status(404).send('InfoBanner non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour du infoBanner avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour du infoBanner avec l'ID ${id}`);
    }
};

const deleteInfoBanner = async (req, res) => {

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const { id } = req.params;

    try {
        const client = await pool.connect();
        const result = await client.query(`UPDATE ${TABLE_NAME} SET Bin = true WHERE id = $1 RETURNING *`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('InfoBanner non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression de l'infoBanner avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression de l'infoBanner avec l'ID ${id}`);
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
    getInfoBanner,
    getInfoBannerById,
    addInfoBanner,
    updateInfoBanner,
    deleteInfoBanner
};