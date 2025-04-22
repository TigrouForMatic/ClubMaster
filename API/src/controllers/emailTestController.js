const emailService = require('../services/emailService');

// Fonction pour créer un nouveau contact
const createContact = async (req, res) => {
    try {
        const { email, attributes } = req.body;

        // Validation de l'email
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email invalide ou manquant' 
            });
        }

        // Validation des attributs
        if (!attributes || typeof attributes !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Les attributs doivent être un objet valide'
            });
        }
        
        const result = await emailService.createContact(email, attributes);
        
        // Vérification du résultat
        if (!result || !result.id) {
            return res.status(400).json({
                success: false,
                message: 'La création du contact a échoué',
                data: result
            });
        }
        
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Erreur détaillée:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du contact',
            error: error.message,
            details: error.response?.data || error.stack
        });
    }
}

const updateContactAttributes = async (req, res) => {
    try {
        const { email, attributes } = req.body;

        // Validation de l'email
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({
                success: false,
                message: 'Email invalide ou manquant'
            });
        }

        // Validation des attributs
        if (!attributes || typeof attributes !== 'object' || Object.keys(attributes).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Les attributs doivent être un objet non vide'
            });
        }

        const result = await emailService.updateContactAttributes(email, attributes);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour des attributs du contact',
            error: error.message
        });
    }
}

// Fonction pour supprimer un contact
const deleteContact = async (req, res) => {
    try {
        const { email } = req.body;

        // Validation de l'email
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({
                success: false,
                message: 'Email invalide ou manquant'
            });
        }

        const result = await emailService.deleteContact(email);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du contact',
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

// Fonction pour ajouter un contact à une liste
const addContactToList = async (req, res) => {
    try {
        const { email, listId } = req.body;

        // Validation de l'email
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({
                success: false,
                message: 'Email invalide ou manquant'
            });
        }

        // Validation de l'ID de la liste
        if (!listId || typeof listId !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'ID de liste invalide ou manquant'
            });
        }

        const result = await emailService.addContactToList(email, listId);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout du contact à la liste',
            error: error.message
        });
    }
}

module.exports = {
    createContact,
    sendWelcomeEmail,
    updateContactAttributes,
    deleteContact,
    addContactToList
};

