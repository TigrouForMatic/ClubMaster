const { pool } = require('../../database');

const TABLE_NAME = 'db.Event';

const getEvent = async (req, res) => {
    const { arrayEventTypeId } = req.query;
    try {
        let queryString = `SELECT * FROM ${TABLE_NAME}`;
        const values = [];
        
        if (arrayEventTypeId && Array.isArray(JSON.parse(arrayEventTypeId))) {
            const eventTypeId = JSON.parse(arrayEventTypeId);
            queryString += ` WHERE eventtypeid = ANY($1) AND Bin = false`;
            values.push(eventTypeId);
        } else {
            queryString += ` WHERE Bin = false`;
        }

        const client = await pool.connect();
        const result = await client.query(queryString, values);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des événements', err);
        res.status(500).send('Erreur lors de la récupération des événements');
    }
};

const getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1 AND Bin = false`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Role non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération de l'événement avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération de l'événement avec l'ID ${id}`);
    }
};

const checkDuplicateEvent = async (client, eventData) => {
    const { EventTypeId, Dd, AddressId } = eventData;
    
    // Vérifier si un événement existe déjà avec le même type, la même date et la même adresse
    const checkQuery = `
        SELECT * FROM ${TABLE_NAME} 
        WHERE EventTypeId = $1 
        AND DATE(Dd) = DATE($2)
        AND AddressId = $3
        AND Bin = false
    `;
    
    const result = await client.query(checkQuery, [EventTypeId, Dd, AddressId]);
    return result.rows.length > 0;
};

const addEvent = async (req, res) => {
    const currentDate = new Date();
    const { Recurrence, ...eventData } = req.body;
    
    if (Recurrence && Recurrence.interval && Recurrence.unit && Recurrence.endDate) {
        try {
            const client = await pool.connect();
            
            // Vérifier le doublon pour le premier événement
            const isDuplicate = await checkDuplicateEvent(client, eventData);
            if (isDuplicate) {
                client.release();
                return res.status(400).json({ 
                    error: 'Un événement du même type existe déjà à cette date et à cette adresse' 
                });
            }
            
            const results = [];
            const endDate = new Date(Recurrence.endDate);
            let currentEventDate = new Date(eventData.Dd);
            
            // Boucle de création des événements récurrents
            while (new Date(currentEventDate.toDateString()) <= new Date(endDate.toDateString())) {
                
                const eventCopy = { ...eventData };
                eventCopy.Dd = new Date(currentEventDate);
                
                // Ajuster la date de fin si elle existe
                if (eventCopy.Df) {
                    const duration = new Date(eventData.Df) - new Date(eventData.Dd);
                    eventCopy.Df = new Date(currentEventDate.getTime() + duration);
                }

                const { columns, values } = prepareInsertData(eventCopy);
                const columnsWithDates = `${columns}, Dc, Dm, Bin`;
                const valuesWithDates = [...values, currentDate, currentDate, false];
                
                const insertQuery = `INSERT INTO ${TABLE_NAME} (${columnsWithDates}) 
                    VALUES (${valuesWithDates.map((_, i) => `$${i + 1}`).join(', ')}) 
                    RETURNING *`;
                
                const result = await client.query(insertQuery, valuesWithDates);
                results.push(result.rows[0]);

                // Calculer la prochaine date selon l'unité de récurrence
                switch (Recurrence.unit.toLowerCase()) {
                    case 'days':
                        currentEventDate.setDate(currentEventDate.getDate() + Recurrence.interval);
                        break;
                    case 'weeks':
                        currentEventDate.setDate(currentEventDate.getDate() + (Recurrence.interval * 7));
                        break;
                    case 'months':
                        currentEventDate.setMonth(currentEventDate.getMonth() + Recurrence.interval);
                        break;
                    case 'years':
                        currentEventDate.setFullYear(currentEventDate.getFullYear() + Recurrence.interval);
                        break;
                }
            }
            
            client.release();
            res.status(201).json(results);
            
        } catch (err) {
            console.error('Erreur lors de la création des événements récurrents', err);
            res.status(500).send('Erreur lors de la création des événements récurrents');
        }
    } else {
        const { columns, values } = prepareInsertData(eventData);

        try {
            const client = await pool.connect();
            
            // Vérifier le doublon
            const isDuplicate = await checkDuplicateEvent(client, eventData);
            if (isDuplicate) {
                client.release();
                return res.status(400).json({ 
                    error: 'Un événement du même type existe déjà à cette date et à cette adresse' 
                });
            }
    
            const columnsWithDates = `${columns}, Dc, Dm, Bin`;
            const valuesWithDates = [...values, currentDate, currentDate, false];
    
            const insertQuery = `INSERT INTO ${TABLE_NAME} (${columnsWithDates}) VALUES (${valuesWithDates.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`;
    
            const result = await client.query(insertQuery, valuesWithDates);
            client.release();
    
            // Récupérer les données insérées
            const insertedEvent = result.rows[0];
    
            // Effectuer une nouvelle requête pour obtenir toutes les données de l'événement
            const selectQuery = `SELECT * FROM ${TABLE_NAME} WHERE id = $1`;
            const selectResult = await client.query(selectQuery, [insertedEvent.id]);
            
            res.status(201).json(selectResult.rows[0]);
        } catch (err) {
            console.error('Erreur lors de l\'ajout d\'un nouveau événement', err);
            res.status(500).send('Erreur lors de l\'ajout d\'un nouveau événement');
        }  
    }
};

const updateEvent = async (req, res) => {

    const { id } = req.params;
    const { updates, values } = prepareUpdateData(req.body);

    try {
        const client = await pool.connect();
        const updateQuery = `UPDATE ${TABLE_NAME} SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
        const result = await client.query(updateQuery, [...values, id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Événement non trouvé');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour de l'événement avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour de l'événement avec l'ID ${id}`);
    }
};

const deleteEvent = async (req, res) => {

    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`UPDATE ${TABLE_NAME} SET Bin = true WHERE id = $1 RETURNING *`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Événement non trouvé');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression de l'événement avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression de l'événement avec l'ID ${id}`);
    }
};

const prepareInsertData = (body) => {
    const columns = Object.keys(body).join(', ');
    const values = Object.values(body);
    return { columns, values };
};

const prepareUpdateData = (body) => {
    const updates = Object.keys(body).map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = Object.values(body);
    return { updates, values };
};

module.exports = {
    getEvent,
    getEventById,
    addEvent,
    updateEvent,
    deleteEvent
};