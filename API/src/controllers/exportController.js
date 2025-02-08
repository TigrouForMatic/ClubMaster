const xlsx = require('xlsx');
const { pool } = require('../../database');

const exportLicencesToExcel = async (req, res) => {
    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const { clubId, etat, isDelete } = req.query;

    try {
        const client = await pool.connect();
        
        // Construction de la requête SQL avec les conditions
        let queryString = `
            SELECT 
                pp.name,
                l.licencefederation,
                lt.label as type,
                l.dd as date_debut,
                l.df as date_fin,
                r.label as role,
                pp.emailaddress,
                pp.phonenumber,
                pp.naissancedate,
                c.label as club
            FROM db.Licence l
            JOIN db.PersonPhysic pp ON l.PersonPhysicId = pp.Id
            LEFT JOIN db.LicenceType lt ON l.licencetypeid = lt.id
            LEFT JOIN db.Role r ON l.roleid = r.id
            LEFT JOIN db.Club c ON lt.clubid = c.id
            WHERE lt.clubid = $1`;

        const values = [clubId];
        let paramCount = 1;

        if (isDelete === true) {
            queryString += ` AND l.bin = true`;
        } else {
            queryString += ` AND l.bin = false`;
        }

        if (etat === 'tout') {
            queryString += ` AND l.df >= NOW()`;
        } else if (etat === 'actif') {
            queryString += ` AND l.df >= NOW()`;
        } else if (etat === 'inactif') {
            queryString += ` AND l.df < NOW()`;
        }
        
        const result = await client.query(queryString, values);
        client.release();

        // Formatage des données pour l'export
        const formattedData = result.rows.map(row => {
            // Vérification et formatage sécurisé des dates
            const formatDate = (dateStr) => {
                if (!dateStr) return '';
                const date = new Date(dateStr);
                return date instanceof Date && !isNaN(date) 
                    ? date.toLocaleDateString('fr-FR')
                    : '';
            };

            return {
                'Nom': row.name || '',
                'Numéro de licence': row.licencefederation || '',
                'Type': row.type || '',
                'Date de début': formatDate(row.date_debut),
                'Date de fin': formatDate(row.date_fin),
                'Rôle': row.role || '',
                'Email': row.emailaddress || '',
                'Téléphone': row.phonenumber || '',
                'Date de naissance': formatDate(row.naissancedate),
                'Club': row.club || ''
            };
        });

        console.log('Données formatées:', formattedData);
        console.log('Nombre de lignes:', formattedData.length);
        console.log('Structure première ligne:', Object.keys(formattedData[0]));

        // Vérification des données avant création du worksheet
        if (!formattedData || formattedData.length === 0) {
            throw new Error('Aucune donnée à exporter');
        }

        // Création de la feuille Excel avec options
        const worksheet = xlsx.utils.json_to_sheet(formattedData);
        const workbook = {
            Sheets: { 'Licences': worksheet },
            SheetNames: ['Licences']
        };
        
        // Envoi du fichier
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        console.log('Buffer size:', buffer.length)

        // Configuration de la réponse HTTP
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="licences.xlsx"');
        res.setHeader('Content-Length', buffer.length);

        // Envoi du buffer
        res.end(buffer);

    } catch (err) {
        console.error('Erreur lors de l\'export des licences', err);
        res.status(500).send('Erreur lors de l\'export des licences');
    }
};

module.exports = {
    exportLicencesToExcel
};
