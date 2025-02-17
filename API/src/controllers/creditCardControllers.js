const { pool } = require('../../database');
const crypto = require('crypto');

const TABLE_NAME = 'db.CreditCard';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes key
const IV_LENGTH = 16; // For AES, this is always 16

const encrypt = (text) => {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (text) => {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

const getCreditCards = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME}`);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des cartes de crédit', err);
        res.status(500).send('Erreur lors de la récupération des cartes de crédit');
    }
};

const getCreditCardById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Carte de crédit non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération de la carte de crédit avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération de la carte de crédit avec l'ID ${id}`);
    }
};

const addCreditCard = async (req, res) => {
    const { personPhysicId, cardNumber, expirationDate, cvv, cardType } = req.body;
    const currentDate = new Date();

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const encryptedCardNumber = encrypt(cardNumber);
    const encryptedExpirationDate = encrypt(expirationDate);
    const encryptedCVV = encrypt(cvv);
    const lastFourDigits = cardNumber.slice(-4);

    try {
        const client = await pool.connect();
        const insertQuery = `INSERT INTO ${TABLE_NAME} (Dc, Dm, PersonPhysicId, EncryptedCardNumber, EncryptedExpirationDate, EncryptedCVV, LastFourDigits, CardType) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
        const result = await client.query(insertQuery, [currentDate, currentDate, personPhysicId, encryptedCardNumber, encryptedExpirationDate, encryptedCVV, lastFourDigits, cardType]);
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erreur lors de l\'ajout d\'une nouvelle carte de crédit', err);
        res.status(500).send('Erreur lors de l\'ajout d\'une nouvelle carte de crédit');
    }
};

const updateCreditCard = async (req, res) => {
    const { id } = req.params;
    const { cardNumber, expirationDate, cvv, cardType } = req.body;

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const encryptedCardNumber = encrypt(cardNumber);
    const encryptedExpirationDate = encrypt(expirationDate);
    const encryptedCVV = encrypt(cvv);
    const lastFourDigits = cardNumber.slice(-4);

    try {
        const client = await pool.connect();
        const updateQuery = `UPDATE ${TABLE_NAME} SET EncryptedCardNumber = $1, EncryptedExpirationDate = $2, EncryptedCVV = $3, LastFourDigits = $4, CardType = $5, Dm = $6 WHERE id = $7 RETURNING *`;
        const result = await client.query(updateQuery, [encryptedCardNumber, encryptedExpirationDate, encryptedCVV, lastFourDigits, cardType, new Date(), id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Carte de crédit non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour de la carte de crédit avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour de la carte de crédit avec l'ID ${id}`);
    }
};

const deleteCreditCard = async (req, res) => {
    const { id } = req.params;

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    try {
        const client = await pool.connect();
        const result = await client.query(`DELETE FROM ${TABLE_NAME} WHERE id = $1 RETURNING *`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Carte de crédit non trouvée');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression de la carte de crédit avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression de la carte de crédit avec l'ID ${id}`);
    }
};

module.exports = {
    getCreditCards,
    getCreditCardById,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard
};
