const emailService = require('../services/emailService');

// Dans votre contrôleur d'inscription
async function register(req, res) {
    try {
        const { email, name } = req.body;
        
        if (!email || !name) {
            return res.status(400).json({ error: 'Email et nom requis' });
        }

        // Envoi de l'email de bienvenue
        await emailService.sendWelcomeEmail(email, name);

        res.status(201).json({ message: 'Email de bienvenue envoyé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
}

// Dans votre contrôleur de réinitialisation de mot de passe
async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;
        // Générer un token de réinitialisation
        const resetToken = generateResetToken(); // À implémenter selon votre logique

        // Envoi de l'email de réinitialisation
        await emailService.sendPasswordResetEmail(email, resetToken);

        res.json({ message: 'Email de réinitialisation envoyé' });
    } catch (error) {
        console.error('Erreur lors de la demande de réinitialisation:', error);
        res.status(500).json({ error: 'Erreur lors de la demande de réinitialisation' });
    }
}

module.exports = {
    register,
    requestPasswordReset
};