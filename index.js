const Knex = require('knex');
const knexConfig = require('./knexfile');

const { Model } = require('objection');
const { Poll } = require('./models/Poll');

const knexEnv = process.env.DB_ENV || 'development';
const knex = Knex(knexConfig[knexEnv]);

Model.knex(knex);



const { customAlphabet } = require('nanoid');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 10);



const express = require('express');
const { Pool } = require('pg');

const PORT = process.env.PORT || 5000;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

express()
    .get('/', (req, res) => res.send('hello world'))
    .get('/api/polls', getPolls)
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));



async function getPolls(req, res) {
    await Poll.query().delete();

    await Poll.query().insert({
        id: nanoid(),
        question: 'What is?'
    });

    const polls = await Poll.query();

    res.send(polls);
}


// async function getPolls(req, res) {
//     try {
//         const client = await pool.connect();
//         const result = await client.query('SELECT * from polls');
//         res.send(result);
//         client.release();
//     } catch (e) {
//         console.error(e);
//         res.send('A database error has occurred: ' + e);
//     }
// }
