const axios = require('axios');

class EmailService {
    constructor() {
        const apiKey = process.env.BREVO_API_KEY;
        
        if (!apiKey) {
            throw new Error('La clé API Brevo n\'est pas définie dans les variables d\'environnement (BREVO_API_KEY)');
        }

        // Configuration d'axios pour Brevo
        this.apiClient = axios.create({
            baseURL: 'https://api.brevo.com/v3',
            headers: {
                'api-key': apiKey,
                'Content-Type': 'application/json'
            }
        });
        
        this.defaultSender = {
            email: 'clubmaster@clubmaster.fr',
            name: 'ClubMaster'
        };
    }

    async sendEmail({ to, subject, htmlContent, textContent, templateId, params, headers }) {
        try {
            console.log('Tentative d\'envoi d\'email avec les paramètres:', {
                to,
                subject,
                templateId,
                sender: this.defaultSender
            });

            const emailData = {
                sender: this.defaultSender,
                to: Array.isArray(to) ? to : [{ email: to }]
            };

            // Si un templateId est fourni, on utilise le template
            if (templateId) {
                emailData.templateId = templateId;
                if (params) {
                    emailData.params = params;
                }
            } else {
                // Sinon on utilise le contenu HTML/texte direct
                emailData.subject = subject;
                emailData.htmlContent = htmlContent;
                emailData.textContent = textContent;
            }

            // Ajout des en-têtes personnalisés si fournis
            if (headers) {
                emailData.headers = headers;
            }

            const response = await this.apiClient.post('/smtp/email', emailData);

            console.log('Email envoyé avec succès:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error.response?.data || error);
            throw error;
        }
    }

    // Nouvelle méthode pour envoyer un email avec template
    async sendTemplateEmail({ to, templateId, params = {}, headers = {} }) {
        return this.sendEmail({
            to: Array.isArray(to) ? to : [{ email: to, name: params.name }],
            templateId,
            params,
            headers
        });
    }

    // Méthode pour créer un contact dans Brevo
    async createContact(email, attributes = {}) {
        try {
            const response = await this.apiClient.post('/contacts', {
                email,
                attributes
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création du contact:', error.response?.data || error);
            throw error;
        }
    }

    // Méthode pour mettre à jour les attributs d'un contact dans Brevo
    async updateContactAttributes(identifier, updateData = {}, identifierType = null) {
        try {
            let url = `/contacts/${encodeURIComponent(identifier)}`;
            if (identifierType) {
                url += `?identifierType=${identifierType}`;
            }

            // Modification : Envoyer directement les attributs sans wrapper supplémentaire
            const response = await this.apiClient.put(url, {
                attributes: updateData
            });

            // Vérification de la réponse
            if (response.status !== 204) {
                throw new Error('La mise à jour a échoué');
            }

            return {
                message: 'Contact mis à jour avec succès',
                email: identifier
            };
        } catch (error) {
            console.error('Erreur lors de la mise à jour du contact:', error.response?.data || error);
            throw error;
        }
    }

    // Méthode pour supprimer un contact dans Brevo
    async deleteContact(identifier) {
        try {
            // L'API attend un identifiant (email ou ID) dans l'URL
            const response = await this.apiClient.delete(`/contacts/${encodeURIComponent(identifier)}`, {
                headers: {
                    'accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la suppression du contact:', error.response?.data || error);
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

    // Méthode pour ajouter un contact à une liste Brevo
    async addContactToList(contactIdentifier, listId) {
        try {
            const response = await this.apiClient.post(`/contacts/lists/${listId}/contacts/add`, {
                emails: [contactIdentifier]
            });

            return {
                message: 'Contact ajouté à la liste avec succès',
                data: response.data
            };
        } catch (error) {
            console.error('Erreur lors de l\'ajout du contact à la liste:', error.response?.data || error);
            throw error;
        }
    }
}

module.exports = new EmailService();

// // Exemple d'envoi d'email avec template
// await emailService.sendTemplateEmail({
//     to: {
//         email: "testmail@example.com",
//         name: "John Doe"
//     },
//     templateId: 8,
//     params: {
//         name: "John",
//         surname: "Doe"
//     },
//     headers: {
//         "X-Mailin-custom": "custom_header_1:custom_value_1|custom_header_2:custom_value_2",
//         charset: "iso-8859-1"
//     }
// });

// // Ou avec plusieurs destinataires
// await emailService.sendTemplateEmail({
//     to: [
//         { email: "testmail1@example.com", name: "John Doe" },
//         { email: "testmail2@example.com", name: "Jane Doe" }
//     ],
//     templateId: 8,
//     params: {
//         name: "John",
//         surname: "Doe"
//     }
// });