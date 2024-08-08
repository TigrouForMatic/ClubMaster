const { pool } = require('../../database');

const TABLE_NAME = 'db.Conversation';

const getConversation = async (req, res) => {
    const { arrayClubId } = req.query;
    try {
        let queryString = `SELECT * FROM ${TABLE_NAME}`;
        const values = [];
        
        if (arrayClubId && Array.isArray(JSON.parse(arrayClubId))) {
            const clubIds = JSON.parse(arrayClubId);
            queryString += ` WHERE clubid = ANY($1)`;
            values.push(clubIds);
        }

        const client = await pool.connect();
        const result = await client.query(queryString, values);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des conversations', err);
        res.status(500).send('Erreur lors de la récupération des conversations');
    }
};

const getConversationByEvent = async (req, res) => {
    try {
      const eventId = req.params.id;
  
      const client = await pool.connect();
      const result = await client.query(`
        SELECT
          c.Id AS ConversationId,
          c.EventId,
          c.Dc AS CreatedAt,
          m.Id AS MessageId,
          pp.Name AS PersonName,
          m.Content,
          m.Dm AS SentAt
        FROM db.Conversation c
        LEFT JOIN db.Message m ON c.Id = m.ConversationId
        LEFT JOIN db.PersonPhysic pp ON m.PersonPhysicId = pp.Id
        WHERE c.EventId = $1
      `, [eventId]);
  
      client.release();
  
      const conversations = {};
  
      result.rows.forEach(row => {
        const { conversationid, eventid, createdat, messageid, personname, content, sentat } = row;
  
        if (!conversations[conversationid]) {
          conversations[conversationid] = {
            conversationid,
            eventid,
            createdat,
            messages: []
          };
        }
  
        if (messageid) {
          conversations[conversationid].messages.push({
            messageid,
            personname,
            content,
            sentat
          });
        }
      });
  
      res.json(Object.values(conversations));
    } catch (error) {
      console.error('Error in getConversationByEvent:', error);
      if (error.code === '22P02') {
        // Error code for invalid input parameter
        return res.status(400).send('Invalid event ID provided');
      } else if (error.code === '23503') {
        // Error code for foreign key violation
        return res.status(400).send('Event ID does not exist in the database');
      } else {
        return res.status(500).send('An unexpected error occurred while fetching conversations');
      }
    }
  };

const getConversationById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Conversation non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la récupération de la conversation avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la récupération de la conversation avec l'ID ${id}`);
    }
};

const addConversation = async (req, res) => {
    const currentDate = new Date();

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const { columns, values } = prepareInsertData(req.body);

    try {
        const client = await pool.connect();

        const columnsWithDates = `${columns}, Dc, Dm`;
        const valuesWithDates = [...values, currentDate, currentDate];

        const insertQuery = `INSERT INTO ${TABLE_NAME} (${columnsWithDates}) VALUES (${valuesWithDates.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`;

        const result = await client.query(insertQuery, valuesWithDates);

        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erreur lors de l\'ajout d\'une nouvelle conversation', err);
        res.status(500).send('Erreur lors de l\'ajout d\'une nouvelle conversation');
    }
};

const updateConversation = async (req, res) => {

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const { id } = req.params;
    const { updates, values } = prepareUpdateData(req.body);

    try {
        const client = await pool.connect();
        const updateQuery = `UPDATE ${TABLE_NAME} SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
        const result = await client.query(updateQuery, [...values, id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Conversation non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la mise à jour de la conversation avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la mise à jour de la conversation avec l'ID ${id}`);
    }
};

const deleteConversation = async (req, res) => {

    // Vérification de l'authentification
    if (!req.user) return res.sendStatus(401);

    const { id } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query(`DELETE FROM ${TABLE_NAME} WHERE id = $1 RETURNING *`, [id]);
        client.release();
        if (result.rows.length === 0) {
            return res.status(404).send('Conversation non trouvée');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(`Erreur lors de la suppression de la conversation avec l'ID ${id}`, err);
        res.status(500).send(`Erreur lors de la suppression de la conversation avec l'ID ${id}`);
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
    getConversation,
    getConversationByEvent,
    getConversationById,
    addConversation,
    updateConversation,
    deleteConversation
};