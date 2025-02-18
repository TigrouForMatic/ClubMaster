const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
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
});

const getPhoto = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier uploadé');
    }
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Photos WHERE id = $1', [id]);
    res.status(200).json(result.rows[0]);
};

const deletePhoto = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier uploadé');
    }
    try {
        const { id } = req.params;
        const result = await pool.query('UPDATE Photos SET Bin = TRUE WHERE id = $1', [id]);
        res.status(200).json({ message: 'Photo supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la photo:', error);
        res.status(500).send('Erreur lors de la suppression de la photo');
    }
};

const getPhotos = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier uploadé');
    }
    const result = await pool.query('SELECT * FROM Photos WHERE Bin = FALSE');
    res.status(200).json(result.rows);
};


const addPhoto = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier uploadé');
    }

    try {
        const { referenceid, referencetype } = req.body;
        const photoData = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: `/uploads/${req.file.filename}`,
            referenceid,
            referencetype,
            createdby: req.user.id
        };

        const result = await pool.query(
            'INSERT INTO Photos (filename, originalname, mimetype, size, url, referenceid, referencetype, createdby) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [photoData.filename, photoData.originalname, photoData.mimetype, photoData.size, photoData.url, photoData.referenceid, photoData.referencetype, photoData.createdby]
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