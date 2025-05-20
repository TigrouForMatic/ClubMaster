const { pool } = require('../../database');
const emailService = require('./emailService');

const sendEventNotifications = async () => {
    try {
        const client = await pool.connect();
        
        // Récupérer les événements qui arrivent aujourd'hui ou dans 3 jours
        const eventsQuery = `
            SELECT e.*, et.clubid, 
                   c.label as club_label,
                   a.street, a.city, a.postalcode
            FROM db.Event e
            JOIN db.EventType et ON e.EventTypeId = et.id
            JOIN db.Club c ON et.clubid = c.id
            JOIN db.Address a ON e.AddressId = a.id
            WHERE e.Bin = false 
            AND (
                DATE(e.Dd) = CURRENT_DATE 
                OR DATE(e.Dd) = CURRENT_DATE + INTERVAL '3 days'
            )
        `;
        
        const eventsResult = await client.query(eventsQuery);
        
        // Préparer la liste des événements
        const listeEvenements = eventsResult.rows.map(event => {
            const dd = new Date(event.dd);
            const ddGMT = new Date(dd.getTime() + dd.getTimezoneOffset() * 60000);
            const today = new Date();
            const joursRestants = Math.ceil((dd - today) / (1000 * 60 * 60 * 24));
            
            return {
                nom: event.label,
                date: dd.toISOString().split('T')[0],
                horaire: `${(ddGMT.getHours()+2).toString().padStart(2, '0')}:${ddGMT.getMinutes().toString().padStart(2, '0')}`,
                lieu: `${event.street}, ${event.postalcode} ${event.city}`,
                jours_restant: joursRestants
            };
        });
        
        // Récupérer les contacts du club
        const contactsQuery = `
            SELECT DISTINCT l.login, l.firstname, l.lastname 
            FROM db.Login l
            JOIN db.Licence lic ON l.id = lic.loginid
            JOIN db.LicenceType lt ON lic.licencetypeid = lt.id
            WHERE lt.clubid = $1 
            AND lic.df >= NOW()
            AND lic.bin = false
            AND l.brevoid IS NOT NULL
        `;
        
        for (const event of eventsResult.rows) {
            const contactsResult = await client.query(contactsQuery, [event.clubid]);
            
            const emailParams = {
                liste_evenements: listeEvenements,
                nom_club: event.club_label,
                lien_inscription: `https://clubmaster.fr/event/${event.id}`
            };
            
            // Déterminer le template en fonction de la date
            const isToday = new Date(event.dd).toDateString() === new Date().toDateString();
            const templateId = isToday ? 5 : 4; // 5 pour le jour même, 4 pour J-3
            
            for (const contact of contactsResult.rows) {
                try {
                    await emailService.sendTemplateEmail({
                        to: contact.login,
                        templateId,
                        params: {
                            ...emailParams,
                            FIRSTNAME: contact.firstname || 'cher adhérent'
                        },
                        headers: {
                            'api-key': process.env.BREVO_API_KEY
                        }
                    });
                } catch (emailError) {
                    console.error(`Erreur lors de l'envoi de l'email à ${contact.login}:`, emailError);
                }
            }
        }
        
        client.release();
    } catch (error) {
        console.error('Erreur lors de l\'envoi des notifications d\'événements:', error);
    }
};

module.exports = {
    sendEventNotifications
};