const eventNotificationService = require('../services/eventNotificationService');

async function runDailyNotifications() {
    try {
        await eventNotificationService.sendEventNotifications();
        console.log('Notifications d\'événements envoyées avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'exécution des notifications quotidiennes:', error);
    } finally {
        process.exit();
    }
}

runDailyNotifications(); 