// index.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', // Adjust if needed
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // This ensures SSL mode for Neon DB
    }
});

app.post('/storePoll', async (req, res) => {
    const { pollId, nid, candidate1Votes, candidate2Votes, candidate3Votes, transactionHash } = req.body;
    
    try {
        const result = await pool.query(
            'INSERT INTO polls (poll_id, nid, candidate1_votes, candidate2_votes, candidate3_votes, transaction_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [pollId, nid, candidate1Votes, candidate2Votes, candidate3Votes, transactionHash]
        );
        console.log('Poll stored successfully:', result.rows[0]);
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error storing poll:', error);
        res.status(500).json({ success: false, message: 'Error storing poll data' });
    }
});

// index.js
app.get('/getPolls', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM polls');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving poll data:', error);
        res.status(500).json({ success: false, message: 'Error retrieving poll data' });
    }
});





const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
