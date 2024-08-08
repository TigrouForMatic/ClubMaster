const { pool } = require('../../database');

const genericController = (tableName) => ({
    getAll: async (req, res) => {
        const filters = req.query;
        try {
            let queryString = `SELECT * FROM db.${tableName}`;
            const values = [];
            
            if (Object.keys(filters).length > 0) {
                const filterConditions = Object.entries(filters).map(([key, value], index) => {
                    values.push(value);
                    return `${key} = $${index + 1}`;
                });
                queryString += ' WHERE ' + filterConditions.join(' AND ');
            }

            const client = await pool.connect();
            const result = await client.query(queryString, values);
            client.release();
            res.json(result.rows);
        } catch (err) {
            console.error(`Error retrieving entries from ${tableName}`, err);
            res.status(500).send(`Error retrieving entries from ${tableName}`);
        }
    },

    getById: async (req, res) => {
        const { id } = req.params;
        try {
            const client = await pool.connect();
            const result = await client.query(`SELECT * FROM db.${tableName} WHERE id = $1`, [id]);
            client.release();
            if (result.rows.length === 0) {
                return res.status(404).send('Entry not found');
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error(`Error retrieving entry from ${tableName} with ID ${id}`, err);
            res.status(500).send(`Error retrieving entry from ${tableName} with ID ${id}`);
        }
    },

    create: async (req, res) => {
        const { columns, values } = prepareInsertData(req.body);
        try {
            const client = await pool.connect();

            const currentDate = new Date();

            const columnsWithDates = `${columns}, Dc, Dm`;
            const valuesWithDates = [...values, currentDate, currentDate];
    
            const insertQuery = `INSERT INTO ${TABLE_NAME} (${columnsWithDates}) VALUES (${valuesWithDates.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`;
    
            const result = await client.query(insertQuery, valuesWithDates);
            client.release();
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(`Error adding new entry to ${tableName}`, err);
            res.status(500).send(`Error adding new entry to ${tableName}`);
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { updates, values } = prepareUpdateData(req.body);
        try {
            const client = await pool.connect();
            const updateQuery = `UPDATE db.${tableName} SET ${updates} WHERE id = $${values.length + 1} RETURNING *`;
            const result = await client.query(updateQuery, [...values, id]);
            client.release();
            if (result.rows.length === 0) {
                return res.status(404).send('Entry not found');
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error(`Error updating entry in ${tableName} with ID ${id}`, err);
            res.status(500).send(`Error updating entry in ${tableName} with ID ${id}`);
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;
        try {
            const client = await pool.connect();
            const result = await client.query(`DELETE FROM db.${tableName} WHERE id = $1 RETURNING *`, [id]);
            client.release();
            if (result.rows.length === 0) {
                return res.status(404).send('Entry not found');
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error(`Error deleting entry from ${tableName} with ID ${id}`, err);
            res.status(500).send(`Error deleting entry from ${tableName} with ID ${id}`);
        }
    }
});

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

module.exports = genericController;