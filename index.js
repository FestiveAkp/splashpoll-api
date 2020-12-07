const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Polls = require('./api/PollsController');

const PORT = process.env.PORT || 5000;

express()
    .use(helmet())
    .use(express.json())
    .use(cors())
    .use(morgan('dev'))
    .get('/', (_, res) => res.send('hello world'))
    .get('/api/polls', Polls.index)                                 // polls.index
    .post('/api/polls', Polls.storeValidator, Polls.store)          // polls.store
    .get('/api/polls/:id', Polls.show)                              // polls.show
    .get('/api/polls/:id/stream', Polls.stream)                     // polls.stream
    .patch('/api/polls/:id', Polls.updateValidator, Polls.update)   // polls.update
    .delete('/api/polls/:id', Polls.destroy)                        // polls.delete
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));
