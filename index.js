import express from 'express';
const PORT = process.env.PORT || 5000;

express()
    .get('/', (req, res) => res.send('hello world'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`))
