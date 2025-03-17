const { pool } = require('../../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const createAccount = async (req, res) => {
    const { login, password } = req.body;
    const currentDate = new Date();

    try {
        const client = await pool.connect();

        try {
            // Vérifier si le login existe déjà
            const checkLoginQuery = 'SELECT 1 FROM db.Login WHERE Login = $1';
            const checkLoginResult = await client.query(checkLoginQuery, [login]);

            if (checkLoginResult.rows.length > 0) {
                return res.status(400).json({ message: "Ce login est déjà utilisé" });
            }

            // Hacher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insérer le nouvel utilisateur avec les dates de création et modification
            const insertUserQuery = 'INSERT INTO db.Login (Dc, Dm, Bin, LastLogin, Login, Password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING Id, Login';
            const insertUserResult = await client.query(insertUserQuery, [currentDate, currentDate, false, currentDate, login, hashedPassword]);

            const user = insertUserResult.rows[0];

            // Générer un token JWT
            const token = jwt.sign(
                { userId: user.id, login: user.login },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(201).json({ 
                message: "Compte créé avec succès",
                token,
                user
            });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Erreur lors de la création du compte', err);
        res.status(500).json({ message: 'Erreur lors de la création du compte' });
    }
};

const testLogin = async (req, res) => {
    const { login, password } = req.body;

    try {
        const client = await pool.connect();

        try {
            const getUserQuery = 'SELECT * FROM db.Login WHERE Login = $1 AND Bin = false';
            const getUserResult = await client.query(getUserQuery, [login]);

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
                { userId: user.id, login: user.login },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            const currentDate = new Date(); 

            const updateLastLoginQuery = 'UPDATE db.Login SET LastLogin = $1 WHERE Id = $2';
            await client.query(updateLastLoginQuery, [currentDate, user.id]);

            const userData = {
                id: user.id,
                login: user.login,
                pseudo: user.pseudo,
                firstname: user.firstname,
                lastname: user.lastname,
                naissancedate: user.naissancedate,
                phonenumber: user.phonenumber,
                token: token
            }

            res.status(200).json({ 
                message: "Login réussi", 
                user: userData
            });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Erreur lors de la tentative de connexion', err);
        res.status(500).json({ message: 'Erreur lors de la tentative de connexion' });
    }
};

const testAdminLogin = async (req, res) => {
    const { login, password } = req.body;

    try {
        const client = await pool.connect();

        try {
            const getUserQuery = 'SELECT * FROM db.AdminLogin WHERE Login = $1 AND Bin = false';
            const getUserResult = await client.query(getUserQuery, [login]);

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
                { userId: user.id, login: user.login },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            const currentDate = new Date(); 

            const updateLastLoginQuery = 'UPDATE db.AdminLogin SET LastLogin = $1 WHERE Id = $2';
            await client.query(updateLastLoginQuery, [currentDate, user.id]);

            res.status(200).json({ 
                message: "Login réussi", 
                token,
                user: { id: user.id, login: user.login, pseudo : user.pseudo, lastLogin: user.lastLogin }
            });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Erreur lors de la tentative de connexion', err);
        res.status(500).json({ message: 'Erreur lors de la tentative de connexion' });
    }
};

const handleGoogleCallback = async (req, res) => {
    console.log("Début handleGoogleCallback");
    try {
        const { code } = req.body;
        console.log('Code reçu côté API:', code);

        // 1. Échanger le code contre un token d'accès
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: 'https://clubmaster.fr/auth/google/callback',
            grant_type: 'authorization_code'
        });
        console.log('Token Google obtenu:', tokenResponse.data);

        const { access_token } = tokenResponse.data;
        console.log('Access token obtenu:', access_token ? 'Oui' : 'Non');

        // 2. Obtenir les informations de l'utilisateur avec le token
        console.log('Récupération des informations utilisateur...');
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        console.log('Informations utilisateur reçues:', userInfoResponse.data);

        const { email, name, picture } = userInfoResponse.data;
        console.log('Email:', email, 'Nom:', name);

        // 3. Connexion à la base de données
        const client = await pool.connect();

        try {
            // Commencer une transaction
            await client.query('BEGIN');

            // Vérifier si l'utilisateur existe déjà
            const userResult = await client.query(
                'SELECT * FROM db.Login WHERE Login = $1',
                [email]
            );

            let user;

            if (userResult.rows.length > 0) {
                // Utilisateur existant
                user = userResult.rows[0];
                
                // Mettre à jour la dernière connexion
                await client.query(
                    'UPDATE db.Login SET Dm = NOW() WHERE Id = $1',
                    [user.id]
                );
            } else {
                // Créer un nouvel utilisateur
                const newUserResult = await client.query(
                    `INSERT INTO db.Login (Login, Password, Pseudo, Dc, Dm, GoogleId) 
                     VALUES ($1, $2, $3, NOW(), NOW(), $4) 
                     RETURNING *`,
                    [email, 'GOOGLE_AUTH', name, email]
                );

                user = newUserResult.rows[0];
            }

            // Valider la transaction
            await client.query('COMMIT');

            // 4. Générer le JWT
            const token = jwt.sign(
                { 
                    userId: user.id,
                    login: user.login,
                    pseudo: user.pseudo
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Vérifiez que le token est bien généré
            if (!token) {
                throw new Error('Échec de la génération du token');
            }

            // Avant d'envoyer la réponse
            const responseData = {
                message: "Authentification Google réussie",
                token,
                user: {
                    id: user.id,
                    login: user.login,
                    pseudo: user.pseudo,
                    lastLogin: new Date()
                }
            };
            console.log('Données envoyées au client:', responseData);
            
            // Envoyer la réponse avec le bon format
            return res.status(200).json(responseData);

        } catch (error) {
            // En cas d'erreur, annuler la transaction
            await client.query('ROLLBACK');
            throw error;
        } finally {
            // Libérer le client
            client.release();
        }

    } catch (error) {
        console.error('Erreur complète:', error);
        console.error('Stack trace:', error.stack);
        
        // Si l'erreur vient de Google
        if (error.response?.data) {
            console.error('Erreur Google:', error.response.data);
        }

        return res.status(500).json({
            message: "Erreur lors de l'authentification Google",
            error: error.message,
            details: error.response?.data
        });
    }
};

module.exports = {
    createAccount,
    testLogin,
    testAdminLogin,
    handleGoogleCallback
};