const { pool } = require('../../database');
const emailService = require('../services/emailService');

const TABLE_NAME = 'db.Login';

const getLogin = async (req, res) => {
    const filters = req.query;

    try {
        let queryString = `SELECT * FROM ${TABLE_NAME}`;
        const values = [];
        
        if (Object.keys(filters).length > 0) {
            const filterConditions = Object.entries(filters).map(([key, value], index) => {
                values.push(value);
                return `${key} = $${index + 1}`;
            });
            queryString += ' WHERE ' + filterConditions.join(' AND ');
        }

        const client = await pool.connect();
        const result = await client.query(queryString, values);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des logins', err);
        res.status(500).send('Erreur lors de la récupération des logins');
    }
};

const getLoginById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1 AND Bin = false`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Login non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération du login avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération du login avec l'ID ${id}`);
    }
};

const addLogin = async (req, res) => {
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
        console.error('Erreur lors de l\'ajout d\'un nouveau login', err);
        res.status(500).send('Erreur lors de l\'ajout d\'un nouveau login');
    }
};

const createAccountData = async (req, res) => {
    const { id } = req.params;
    const { updates, values } = prepareUpdateData(req.body);

    const currentDate = new Date(); 

    // Vérification du numéro de téléphone s'il est présent dans la requête
    if (req.body.phoneNumber && req.body.phoneNumber !== '') {
        try {
            let queryString = `SELECT * FROM ${TABLE_NAME} WHERE PhoneNumber = $1 AND Bin = false`;

            const client = await pool.connect();
            const result = await client.query(queryString, [req.body.phoneNumber]);
            client.release();
            if (result.rows.length > 0) {
                return res.status(400).send('Ce numéro de téléphone existe déjà');
            }
        } catch (err) {
            console.error('Erreur lors de la vérification de l\'existence du numéro de téléphone', err);
            res.status(500).send('Erreur lors de la vérification de l\'existence du numéro de téléphone');
        }
    }

    // const email = req.body.emailaddress;
    // const attributes = {
    //     PRENOM: req.body.firstName,
    //     NOM: req.body.lastName,
    //     DATE_DE_NAISSANCE: req.body.naissanceDate,
    //     TELEPHONE: req.body.phoneNumber,
    //     ID_DE_CONNEXION: req.body.loginId
    // };

    // let brevoResponse = null;

    // if (email) {
    //     brevoResponse = await emailService.createContact(email, attributes);
    // }

    let contactId = null;
    // if (brevoResponse) {
    //     contactId = brevoResponse.data.id;
    // }

    try {
        const client = await pool.connect();
        
        // Créer un objet avec toutes les valeurs à mettre à jour
        const allUpdates = {
            ...req.body,
            Dm: currentDate,
            ContactId: contactId
        };
        
        const { updates, values } = prepareUpdateData(allUpdates);
        const updateQuery = `UPDATE ${TABLE_NAME} SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
        const result = await client.query(updateQuery, [...values, id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Login non trouvée');
        }

        const userData = {
            id: result.rows[0].id,
            login: result.rows[0].login,
            pseudo: result.rows[0].pseudo,
            firstname: result.rows[0].firstname,
            lastname: result.rows[0].lastname,
            naissancedate: result.rows[0].naissancedate,
            phonenumber: result.rows[0].phonenumber
        }

        res.status(201).json({
            message: "Compte créé avec succès",
            user: userData
        });
    } catch (err) {
        console.error(`Erreur lors de la mise à jour du login avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour du login avec l'ID ${id}`);
    }
};

const updateLogin = async (req, res) => {
    const { id } = req.params;
    const { updates, values } = prepareUpdateData(req.body);

    try {
        const client = await pool.connect();
        const updateQuery = `UPDATE ${TABLE_NAME} SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
        const result = await client.query(updateQuery, [...values, id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Login non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour du login avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour du login avec l'ID ${id}`);
    }
};

const deleteLogin = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`UPDATE ${TABLE_NAME} SET Bin = true WHERE id = $1 RETURNING *`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Login non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression du login avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression du login avec l'ID ${id}`);
    }
};

const prepareInsertData = (body) => {
    // Filtrer les valeurs vides pour les champs de type date
    const filteredBody = Object.fromEntries(
        Object.entries(body).map(([key, value]) => {
            // Si la valeur est une chaîne vide et que le champ est une date, la remplacer par null
            if (value === '' && (key.toLowerCase().includes('date') || key.toLowerCase().includes('dt'))) {
                return [key, null];
            }
            return [key, value];
        })
    );

    const columns = Object.keys(filteredBody).join(', ');
    const values = Object.values(filteredBody);
    return { columns, values };
};

const prepareUpdateData = (body) => {
    const updates = Object.keys(body).map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = Object.values(body);
    return { updates, values };
};

module.exports = {
    getLogin,
    getLoginById,
    createAccountData,
    addLogin,
    updateLogin,
    deleteLogin
};
