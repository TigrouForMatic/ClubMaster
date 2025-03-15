const emailService = require('../services/emailService');

// Fonction pour créer un nouveau contact
const createContact = async (req, res) => {
    try {
        const { email, attributes } = req.body;

        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: 'L\'email est requis' 
            });
        }

        const result = await emailService.createContact(email, attributes);
        
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du contact',
            error: error.message
        });
    }
}

// Fonction pour envoyer un email avec template
const sendWelcomeEmail = async (req, res) => {
    try {
        const { to, params, headers } = req.body;

        if (!to) {
            return res.status(400).json({
                success: false,
                message: 'Le destinataire (to) et l\'ID du template sont requis'
            });
        }

        const templateId = 2;

        const result = await emailService.sendTemplateEmail({
            to,
            templateId,
            params,
            headers
        });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi de l\'email',
            error: error.message
        });
    }
}

module.exports = {
    createContact,
    sendWelcomeEmail
};

