const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3200;

app.use(cors());

// Configuration de la connexion à la base de données
const pool = new Pool({
    user: 'docker',
    host: 'db',
    database: 'docker',
    password: 'docker',
    port: 5432,
});

// Endpoint pour récupérer toutes les sections
app.get('/sections', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM db.Section');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des sections', err);
        res.status(500).send('Erreur lors de la récupération des sections');
    }
});

// Endpoint pour récupérer une section par son ID
app.get('/section/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        const sectionId = req.params.id;
        const query = 'SELECT * FROM db.Section WHERE id = $1';
        const result = await client.query(query, [sectionId]);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération de la section', err);
        res.status(500).send('Erreur lors de la récupération de la section', err);
    }
});

// Endpoint pour récupérer tous les types de sections
app.get('/typesections', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM db.TypeSection');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des types de sections', err);
        res.status(500).send('Erreur lors de la récupération des types de sections');
    }
});

// Endpoint pour récupérer un tyde de section par son ID
app.get('/typesection/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        const typesectionId = req.params.id;
        const query = 'SELECT * FROM db.TypeSection WHERE id = $1';
        const result = await client.query(query, [typesectionId]);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération du type de section', err);
        res.status(500).send('Erreur lors de la récupération du type de section', err);
    }
});

// Endpoint pour récupérer tous les monstres
app.get('/monstres', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM db.Monstre');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des monstres', err);
        res.status(500).send('Erreur lors de la récupération des monstres');
    }
});

// Endpoint pour récupérer un monstre par son ID
app.get('/bonus/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        const monstreId = req.params.id;
        const query = 'SELECT * FROM db.Monstre WHERE id = $1';
        const result = await client.query(query, [monstreId]);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération du monstre', err);
        res.status(500).send('Erreur lors de la récupération du monstre', err);
    }
});


// Endpoint pour récupérer tous les bonus
app.get('/bonus', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM db.Bonus');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des bonus', err);
        res.status(500).send('Erreur lors de la récupération des bonus', err);
    }
});

// Endpoint pour récupérer un bonus par son ID
app.get('/bonus/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        const bonusId = req.params.id;
        const query = 'SELECT * FROM db.Bonus WHERE id = $1';
        const result = await client.query(query, [bonusId]);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération du bonus', err);
        res.status(500).send('Erreur lors de la récupération du bonus', err);
    }
});


// Endpoint pour récupérer tous les joueurs
app.get('/joueurs', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM db.Joueur');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des joueurs', err);
        res.status(500).send('Erreur lors de la récupération des joueurs');
    }
});


// Endpoint pour récupérer un joueur par son ID
app.get('/joueur/:id', async (req, res) => {
    try {
        const client = await pool.connect();
        const playerId = req.params.id;
        const query = 'SELECT * FROM db.Joueur WHERE id = $1';
        const result = await client.query(query, [playerId]);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération du joueur', err);
        res.status(500).send('Erreur lors de la récupération du joueur');
    }
});

app.use(bodyParser.json());

// Endpoint pour ajouter un nouveau joueur
app.post('/joueur', async (req, res) => {
    try {
        const { Nom, Section, Sections, MaxHabilite, Habilite, MaxEndurance, Endurance, MaxChance, Chance, PieceOr, Potion, Arme, Bouclier, Bijou, Isfinish } = req.body;
        const client = await pool.connect();
        const insertQuery = 'INSERT INTO db.Joueur (Nom, Section, Sections, MaxHabilite, Habilite, MaxEndurance, Endurance, MaxChance, Chance, PieceOr, Potion, Arme, Bouclier, Bijou, Isfinish) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *';
        const insertValues = [Nom, Section, Sections, MaxHabilite, Habilite, MaxEndurance, Endurance, MaxChance, Chance, PieceOr, Potion, Arme, Bouclier, Bijou, Isfinish];

        const result = await client.query(insertQuery, insertValues);
        const insertedJoueur = result.rows[0];

        client.release();
        
        res.status(201).json(insertedJoueur);
    } catch (err) {
        console.error('Erreur lors de l\'ajout du joueur', err);
        res.status(500).send('Erreur lors de l\'ajout du joueur');
    }
});


// Endpoint pour modifier un joueur existant
app.put('/joueur/:id', async (req, res) => {
    const id = req.params.id;
    const { Section, Sections, Habilite, Endurance, Chance, PieceOr, Arme, Bouclier, Bijou, Isfinish } = req.body;
    try {
        const client = await pool.connect();
        const query = `
            UPDATE db.Joueur 
            SET 
                Section = $1, 
                Sections = $2,
                Habilite = $3, 
                Endurance = $4, 
                Chance = $5, 
                PieceOr = $6, 
                Arme = $7, 
                Bouclier = $8, 
                Bijou = $9, 
                Isfinish = $10
            WHERE 
                Id = $11
            RETURNING *;
        `;
        
        const values = [Section, Sections, Habilite, Endurance, Chance, PieceOr, Arme, Bouclier, Bijou, Isfinish, id];
        
        const result = await client.query(query, values);
        const updatedJoueur = result.rows[0];

        client.release();

        res.status(200).json(updatedJoueur);
    } catch (err) {
        console.error('Erreur lors de la mise à jour du joueur', err);
        res.status(500).send('Erreur lors de la mise à jour du joueur');
    }
});


// Endpoint pour récupérer tous les joueurs
app.get('/stat/:idJoueur', async (req, res) => {
    try {
        const client = await pool.connect();
        const playerId = req.params.idJoueur;
        const queryJoueur = 'SELECT * FROM db.Joueur WHERE id = $1';
        const result = await client.query(queryJoueur, [playerId]);

        const playerData = result.rows[0];
        let sectionsString = playerData.sections;
        var sectionsArray = sectionsString.match(/\d+/g);

        let nbCombats = 0;
        for (let i = 0; i < sectionsArray.length; i++) {
            const sectionId = parseInt(sectionsArray[i]);
            const queryTypeSection = 'SELECT Libelle FROM db.TypeSection WHERE Id = (SELECT Type FROM db.Section WHERE Id = $1)';
            const resultTypeSection = await client.query(queryTypeSection, [sectionId]);
            const typeSection = resultTypeSection.rows[0].libelle;
            if (typeSection === 'Combat') {
                nbCombats++;
            }
        }

        let nbCheminSimilaire = 0
        const queryChemin = 'SELECT COUNT(*) as nb  FROM db.Joueur WHERE Sections = $1';
        nbCheminSimilaire = await client.query(queryChemin, [sectionsString]);
        nbCheminSimilaire = parseInt(nbCheminSimilaire.rows[0].nb) - 1

        const queryJoueurTerminer = 'SELECT COUNT(*) as nb FROM db.Joueur WHERE Isfinish = True';
        const resultJoueurTerminer = await client.query(queryJoueurTerminer);
        const joueurTerminer = parseInt(resultJoueurTerminer.rows[0].nb)

        const queryJoueurTerminerSection = 'SELECT COUNT(*) as nb FROM db.Joueur WHERE Section = $1';
        const resultJoueurTerminerSection = await client.query(queryJoueurTerminerSection, [result.rows[0].section]);
        const joueurTerminerSection = parseInt(resultJoueurTerminerSection.rows[0].nb) - 1

        let statFastrunner = false;
        if (sectionsArray.length < 15) {
            const querySectionGagner = 'SELECT COUNT(*) as nb FROM db.Section WHERE Id = $1 AND Type = $2';
            const resultSectionGagner = await client.query(querySectionGagner, [result.rows[0].section, 1]);
            const nbSectionGagner = parseInt(resultSectionGagner.rows[0].nb);
            if (nbSectionGagner > 0) {
                statFastrunner = true;
            }
        }

        const queryChances = 'SELECT Chance FROM db.Joueur';
        const resultChances = await client.query(queryChances);
        const totalPlayers = resultChances.rows.length;
        const playerChance = playerData.chance;

        let playersWithHigherChance = 0;
        for (let i = 0; i < totalPlayers; i++) {
            if (resultChances.rows[i].chance <= playerChance) {
                playersWithHigherChance++;
            }
        }
        const chancePercentage = (playersWithHigherChance / totalPlayers) * 100;

        const stats = {
            section_nombre: sectionsArray.length,
            pieceOr_nombre: playerData.pieceor,
            combats_faits: nbCombats,
            joueur_chemin_similaire : nbCheminSimilaire,
            joueur_terminer : joueurTerminer,
            joueur_terminer_meme_section : joueurTerminerSection,
            fastRunner : statFastrunner,
            joueurChanceux : chancePercentage
        };


        res.status(201).json(stats);
    } catch (err) {
        console.error('Erreur lors de la récupération des statistiques', err);
        res.status(500).send('Erreur lors de la récupération des statistiques',err);
    }
});

app.get('/stats', async (req, res) => {
    try {
        const client = await pool.connect();

        // Requêtes existantes
        const victoiresQuery = `
            SELECT COUNT(*) as victoires
            FROM db.Joueur
            WHERE Section = 49 OR Section = 36;
        `;
        const victoiresResult = await client.query(victoiresQuery);
        const victoiresCount = parseInt(victoiresResult.rows[0].victoires, 10);

        const mortsQuery = `
            SELECT COUNT(*) as morts
            FROM db.Joueur
            WHERE Section IN (99, 5, 11, 17, 32, 33, 34, 38, 40, 41, 50);
        `;
        const mortsResult = await client.query(mortsQuery);
        const mortsCount = parseInt(mortsResult.rows[0].morts, 10);

        const bienReponduQuery = `
            SELECT COUNT(*) as bienRepondu
            FROM db.Joueur
            WHERE Sections LIKE '%23%';
        `;
        const bienReponduResult = await client.query(bienReponduQuery);
        const bienReponduCount = parseInt(bienReponduResult.rows[0].bienrepondu, 10);

        const malReponduQuery = `
            SELECT COUNT(*) as malRepondu
            FROM db.Joueur
            WHERE Sections LIKE '%24%';
        `;
        const malReponduResult = await client.query(malReponduQuery);
        const malReponduCount = parseInt(malReponduResult.rows[0].malrepondu, 10);

        const finiQuery = `
            SELECT COUNT(*) as fini
            FROM db.Joueur
            WHERE Isfinish = TRUE;
        `;
        const finiResult = await client.query(finiQuery);
        const finiCount = parseInt(finiResult.rows[0].fini, 10);

        const totalQuery = `
            SELECT COUNT(*) as total
            FROM db.Joueur;
        `;
        const totalResult = await client.query(totalQuery);
        const totalCount = parseInt(totalResult.rows[0].total, 10);

        const sectionsQuery = `
            SELECT sections
            FROM db.Joueur;
        `;
        const sectionsResult = await client.query(sectionsQuery);
        const sectionsArray = sectionsResult.rows.map(row => row.sections);

        const sectionsCount = {};
        sectionsArray.forEach(sections => {
            const cleanSections = sections.replace(/[{}"]/g, '').split(',');
            cleanSections.forEach(section => {
                sectionsCount[section] = (sectionsCount[section] || 0) + 1;
            });
        });

        const sectionsData = Object.keys(sectionsCount).map(section => ({
            section: parseInt(section, 10),
            count: sectionsCount[section],
        }));

        client.release();

        res.json({
            victoires: victoiresCount,
            morts: mortsCount,
            bienRepondu: bienReponduCount,
            malRepondu: malReponduCount,
            fini: finiCount,
            total: totalCount,
            sections: sectionsData,
        });
    } catch (err) {
        console.error('Erreur lors de la récupération des statistiques', err);
        res.status(500).send('Erreur lors de la récupération des statistiques');
    }
});




// Endpoint pour récupérer toutes les sections
app.get('/test', async (req, res) => {
    res.json("Ici ca test");
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
