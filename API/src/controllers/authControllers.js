const { pool } = require('../../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createAccount = async (req, res) => {
    const { login, password } = req.body;

    try {
        const client = await pool.connect();

        console.log(login, password)

        // Vérifier si le login existe déjà
        const checkLoginQuery = 'SELECT * FROM db.Login WHERE Login = $1';
        const checkLoginResult = await client.query(checkLoginQuery, [login]);

        if (checkLoginResult.rows.length > 0) {
            client.release();
            return res.status(400).json({ message: "Ce login est déjà utilisé" });
        }

        // Hacher le mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.log(login, hashedPassword)

        // Insérer le nouvel utilisateur
        const insertUserQuery = 'INSERT INTO db.Login (Login, Password) VALUES ($1, $2) RETURNING Id, Login';
        const insertUserResult = await client.query(insertUserQuery, [login, hashedPassword]);

        console.log(insertUserResult)

        client.release();

        res.status(201).json({ 
            message: "Compte créé avec succès", 
            user: insertUserResult.rows[0] 
        });
    } catch (err) {
        console.error('Erreur lors de la création du compte', err);
        res.status(500).json({ message: 'Erreur lors de la création du compte', error: err.message });
    }
};

const testLogin = async (req, res) => {
    const { login, password } = req.body;

    try {
        const client = await pool.connect();

        const getUserQuery = 'SELECT * FROM db.Login WHERE Login = $1';
        const getUserResult = await client.query(getUserQuery, [login]);

        client.release();

        if (getUserResult.rows.length === 0) {
            return res.status(401).json({ message: "Login ou mot de passe incorrect" });
        }

        const user = getUserResult.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Login ou mot de passe incorrect" });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { userId: user.id, login: user.login, pseudo: user.pseudo },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            message: "Login réussi", 
            token,
            user: { id: user.id, login: user.login, pseudo: user.pseudo }
        });
    } catch (err) {
        console.error('Erreur lors de la tentative de connexion', err);
        res.status(500).json({ message: 'Erreur lors de la tentative de connexion', error: err.message });
    }
};

module.exports = {
    createAccount,
    testLogin
};