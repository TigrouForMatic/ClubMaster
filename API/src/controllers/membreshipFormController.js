const { pool } = require('../../database');

const TABLE_NAME = 'db.MembershipForm';

const getMembershipForm = async (req, res) => {
    const { arrayClubId } = req.query;
    try {
        let queryString = `SELECT * FROM ${TABLE_NAME}`;
        const values = [];
        
        if (arrayClubId && Array.isArray(JSON.parse(arrayClubId))) {
            const clubIds = JSON.parse(arrayClubId);
            queryString += ` WHERE clubid = ANY($1) AND Bin = false`;
            values.push(clubIds);
        } else {
            queryString += ` WHERE Bin = false`;
        }

        const client = await pool.connect();
        const result = await client.query(queryString, values);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des formulaire d\'adhésion', err);
        res.status(500).send('Erreur lors de la récupération des formulaire d\'adhésion');
    }
};

const getMembershipFormById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Formulaire d\'adhésion non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération du formulaire d'adhésion avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération du formulaire d'adhésion avec l'ID ${id}`);
    }
};

const addMembershipForm = async (req, res) => {
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
        console.error('Erreur lors de l\'ajout d\'un nouveau formulaire d\'adhésion', err);
        res.status(500).send('Erreur lors de l\'ajout d\'un nouveau formulaire d\'adhésion');
    }
};

const updateMembershipForm = async (req, res) => {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
        return res.status(400).json({ 
            error: 'ID invalide ou manquant',
            details: 'L\'ID du formulaire d\'adhésion doit être un nombre valide'
        });
    }

    const { updates, values } = prepareUpdateData(req.body);

    try {
        const client = await pool.connect();
        const updateQuery = `UPDATE ${TABLE_NAME} SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
        const result = await client.query(updateQuery, [...values, id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Formulaire d\'adhésion non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour du formulaire d'adhésion avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour du formulaire d'adhésion avec l'ID ${id}`);
    }
};

const deleteMembershipForm = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`UPDATE ${TABLE_NAME} SET Bin = true WHERE id = $1 RETURNING *`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Formulaire d\'adhésion non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression du formulaire d'adhésion avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression du formulaire d'adhésion avec l'ID ${id}`);
    }
};

const downloadMembershipForm = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                mf.*, 
                c.label as club_name,
                p.url as photo_url
            FROM ${TABLE_NAME} mf 
            JOIN db.Club c ON c.id = mf.clubid 
            LEFT JOIN db.Photos p ON p.referenceid = mf.id AND p.referenceType = 'membershipForm'
            WHERE mf.id = $1
        `, [id]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).send('Formulaire d\'adhésion non trouvé');
        }

        const membershipForm = result.rows[0];
        const PDFDocument = require('pdfkit');
        
        // Création du document PDF au format A4
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50
        });

        // Création d'une promesse pour gérer la génération du PDF
        const pdfBuffer = await new Promise((resolve, reject) => {
            const chunks = [];
            
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // En-tête avec logo si disponible
            if (membershipForm.photo_url) {
                doc.image(membershipForm.photo_url, 50, 50, { width: 90 });
            }

            // Nom du club et période
            doc.fontSize(24).text(membershipForm.club_name, { align: 'center', y: 50 });
            doc.fontSize(14).text(membershipForm.period, { align: 'center' });

            // Titre du formulaire
            doc.moveDown(2);
            doc.fontSize(18).text(membershipForm.title, { align: 'center' });

            // Description
            doc.moveDown(2);
            doc.fontSize(12).text(membershipForm.description, { align: 'left' });

            // Texte légal
            doc.moveDown(2);
            doc.fontSize(10).text(membershipForm.legaltext, {
                align: 'left',
                backgroundColor: '#f9fafb',
                padding: 10
            });

            // Partie basse du document
            doc.y = 700;

            // Case à cocher pour la prise de connaissance
            if (membershipForm.requiresacknowledgment) {
                doc.fontSize(10).text('☐ Je déclare avoir pris connaissance des conditions d\'adhésion');
            }

            // Zone de signature
            if (membershipForm.requiresignature) {
                doc.moveDown();
                doc.fontSize(10).text('Signature :');
                doc.moveTo(doc.x, doc.y + 5)
                   .lineTo(doc.x + 200, doc.y + 5)
                   .stroke();
            }

            // Date et lieu
            doc.moveDown(2);
            doc.fontSize(10).text('Fait à _____________, le ____ / ____ / ________', { align: 'right' });

            doc.end();
        });

        // Configuration des en-têtes de la réponse
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.setHeader('Content-Disposition', `attachment; filename=formulaire-adhesion-${membershipForm.club_name}.pdf`);

        // Envoi du PDF
        res.send(pdfBuffer);

    } catch (err) {
        console.error('Erreur lors du téléchargement du formulaire:', err);
        res.status(500).send('Erreur lors du téléchargement du formulaire');
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
    getMembershipForm,
    getMembershipFormById,
    addMembershipForm,
    updateMembershipForm,
    deleteMembershipForm,
    downloadMembershipForm
};