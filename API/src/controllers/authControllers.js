const { pool } = require('../../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createAccount = async (req, res) => {
    const { email, password } = req.body;

    try {
        const client = await pool.connect();

        // Vérifier si l'email existe déjà
        const checkEmailQuery = 'SELECT * FROM db.login WHERE email = $1';
        const checkEmailResult = await client.query(checkEmailQuery, [email]);

        if (checkEmailResult.rows.length > 0) {
            client.release();
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }

        // Hacher le mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insérer le nouvel utilisateur
        const insertUserQuery = 'INSERT INTO db.login (email, password) VALUES ($1, $2) RETURNING id, email';
        const insertUserResult = await client.query(insertUserQuery, [email, hashedPassword]);

        client.release();

        res.status(201).json({ 
            message: "Compte créé avec succès", 
            user: insertUserResult.rows[0] 
        });
    } catch (err) {
        console.error('Erreur lors de la création du compte', err);
        res.status(500).send('Erreur lors de la création du compte');
    }
};

const testLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const client = await pool.connect();

        const getUserQuery = 'SELECT * FROM db.login WHERE email = $1';
        const getUserResult = await client.query(getUserQuery, [email]);

        client.release();

        if (getUserResult.rows.length === 0) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const user = getUserResult.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            message: "Login réussi", 
            token,
            user: { id: user.id, email: user.email }
        });
    } catch (err) {
        console.error('Erreur lors de la tentative de connexion', err);
        res.status(500).send('Erreur lors de la tentative de connexion');
    }
};

module.exports = {
    createAccount,
    testLogin
};