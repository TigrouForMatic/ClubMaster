const SibApiV3Sdk = require('sib-api-v3-sdk');

class EmailService {
    constructor() {
        const apiKey = process.env.BREVO_API_KEY;
        
        if (!apiKey) {
            throw new Error('La clé API Brevo n\'est pas définie dans les variables d\'environnement (BREVO_API_KEY)');
        }

        // Initialisation du client Brevo
        let defaultClient = SibApiV3Sdk.ApiClient.instance;
        defaultClient.authentications['api-key'].apiKey = apiKey;
        
        this.client = new SibApiV3Sdk.TransactionalEmailsApi();
        
        this.defaultSender = {
            email: 'clubmaster@clubmaster.fr',
            name: 'ClubMaster'
        };
    }

    async sendEmail({ to, subject, htmlContent, textContent }) {
        try {
            const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
            
            // Configuration de l'email
            sendSmtpEmail.sender = this.defaultSender;
            sendSmtpEmail.to = [{ email: to }];
            sendSmtpEmail.subject = subject;
            sendSmtpEmail.htmlContent = htmlContent;
            sendSmtpEmail.textContent = textContent;

            console.log('Tentative d\'envoi d\'email avec les paramètres:', {
                to,
                subject,
                sender: this.defaultSender
            });

            const response = await this.client.sendTransacEmail(sendSmtpEmail);
            console.log('Email envoyé avec succès:', response);
            return response;
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            throw error;
        }
    }

    // Méthode pour envoyer un email de bienvenue
    async sendWelcomeEmail(userEmail, userName) {
        const subject = 'Bienvenue sur ClubMaster !';
        const htmlContent = `
            <h1>Bienvenue ${userName} sur ClubMaster !</h1>
            <p>Nous sommes ravis de vous compter parmi nos membres.</p>
            <p>Vous pouvez maintenant accéder à toutes les fonctionnalités de notre plateforme.</p>
        `;
        const textContent = `Bienvenue ${userName} sur ClubMaster ! Nous sommes ravis de vous compter parmi nos membres.`;

        return this.sendEmail({
            to: userEmail,
            subject,
            htmlContent,
            textContent
        });
    }

    // Méthode pour envoyer un email de réinitialisation de mot de passe
    async sendPasswordResetEmail(userEmail, resetToken) {
        const subject = 'Réinitialisation de votre mot de passe';
        const resetLink = `https://votre-domaine.com/reset-password?token=${resetToken}`;
        
        const htmlContent = `
            <h1>Réinitialisation de votre mot de passe</h1>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <p>Cliquez sur le lien suivant pour définir un nouveau mot de passe :</p>
            <a href="${resetLink}">Réinitialiser mon mot de passe</a>
            <p>Ce lien est valable pendant 1 heure.</p>
        `;
        const textContent = `Réinitialisez votre mot de passe en cliquant sur ce lien : ${resetLink}`;

        return this.sendEmail({
            to: userEmail,
            subject,
            htmlContent,
            textContent
        });
    }
}

module.exports = new EmailService();