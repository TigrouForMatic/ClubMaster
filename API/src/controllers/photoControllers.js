const { pool } = require('../../database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const TABLE_NAME = 'db.Photos';

// Assurez-vous que le répertoire uploads existe
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Format de fichier non supporté'));
        }
        cb(null, true);
    }
}).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'referenceid', maxCount: 1 },
    { name: 'referencetype', maxCount: 1 }
]);

const getPhoto = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier uploadé');
    }
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    res.status(200).json(result.rows[0]);
};

const deletePhoto = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier uploadé');
    }
    try {
        const { id } = req.params;
        const result = await pool.query(`UPDATE ${TABLE_NAME} SET Bin = TRUE WHERE id = $1`, [id]);
        res.status(200).json({ message: 'Photo supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la photo:', error);
        res.status(500).send('Erreur lors de la suppression de la photo');
    }
};

const getPhotos = async (req, res) => {
    const { arrayClubId } = req.query;
    try {
        let queryString = `SELECT * FROM ${TABLE_NAME} WHERE Bin = FALSE`;
        const values = [];
        
        if (arrayClubId) {
            try {
                const clubIds = JSON.parse(arrayClubId);
                if (Array.isArray(clubIds)) {
                    queryString += ` AND ClubId = ANY($1)`;
                    values.push(clubIds);
                }
            } catch (error) {
                console.error('Erreur lors du parsing de arrayClubId:', error);
                return res.status(400).send('Format de arrayClubId invalide');
            }
        }

        const result = await pool.query(queryString, values);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des photos:', err);
        res.status(500).send('Erreur lors de la récupération des photos');
    }
};


const addPhoto = async (req, res) => {
    if (!req.files || !req.files.photo) {
        return res.status(400).send('Aucun fichier uploadé');
    }

    try {
        const file = req.files.photo[0];
        const { referenceid, referencetype, clubid } = req.body;
        const photoData = {
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `/uploads/${file.filename}`,
            referenceid,
            referencetype,
            createdby: req.user.id,
            clubid
        };

        // Vérification des données requises
        if (!photoData.referenceid || isNaN(photoData.referenceid)) {
            return res.status(400).json({
                error: 'referenceid manquant ou invalide'
            });
        }
        // Conversion explicite en nombre
        photoData.referenceid = parseInt(photoData.referenceid, 10);

        const currentDate = new Date();
        const columnsWithDates = `filename, originalname, mimetype, size, url, referenceid, referencetype, createdby, clubid, Dc, Dm, Bin`;
        const valuesWithDates = [photoData.filename, photoData.originalname, photoData.mimetype, photoData.size, photoData.url, photoData.referenceid, photoData.referencetype, photoData.createdby, photoData.clubid, currentDate, currentDate, false];

        const result = await pool.query(
            `INSERT INTO ${TABLE_NAME} (${columnsWithDates}) 
             VALUES (${valuesWithDates.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`,
            valuesWithDates
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la photo:', error);
        res.status(500).send('Erreur lors de l\'ajout de la photo');
    }
};

module.exports = {
    getPhotos,
    getPhoto,
    addPhoto,
    upload,
    deletePhoto
};