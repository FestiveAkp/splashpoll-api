const { body, validationResult } = require('express-validator');
const { Objection, Poll } = require('../database');
const nanoid = require('../lib/id');

const Polls = {
    //
    // GET /api/polls
    // Retrieve all polls combined with their choices
    //
    async index(req, res) {
        const polls = await Poll.query().withGraphFetched('choices');
        res.send(polls);
    },


    //
    // POST /api/polls
    // Create a new poll and insert it into the database
    //
    storeValidator: [
        body('question')
            .exists().withMessage('question is required')
            .isLength({ max: 45 }).withMessage('Question should be less than 45 characters'),

        body('openEnded')
            .exists().withMessage('openEnded is required')
            .isBoolean().toBoolean(true).withMessage('openEnded should be a boolean value'),

        body('multipleChoices')
            .exists().withMessage('multipleChoices is required')
            .isBoolean().toBoolean(true).withMessage('multipleChoices should be a boolean value'),

        body('answers')
            .exists().withMessage('answers is required')
            .isArray().withMessage('answers should be an array of strings')
    ],

    async store(req, res) {
        // Check validation rules
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const data = req.body;
        const pollParams = {
            id: nanoid(),
            question: data.question,
            openEnded: data.openEnded,
            multipleChoices: data.multipleChoices,
            totalVotes: 0
        };

        try {
            await Poll.query().insert(pollParams);

            data.answers.forEach(async answer => {
                const choice = { text: answer, votes: 0 };
                await Poll.relatedQuery('choices').for(pollParams.id).insert(choice);
            });

            const newPoll = await Poll.query().withGraphFetched('choices').findById(pollParams.id);
            res.send(newPoll);
        } catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
    },


    //
    // GET /api/polls/{id}
    // Retrieve a single poll by its ID
    //
    async show(req, res) {
        const id = req.params.id;
        const poll = await Poll.query().withGraphFetched('choices').findById(id);
        res.send(poll);
    },


    //
    // GET /api/polls/{id}/stream
    // Uses server-sent events to periodically update client with poll results
    //
    async stream(req, res) {
        // Set headers
        res.set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive'
        });
        res.flushHeaders();

        // Tell client to retry every 2 seconds if connection is lost
        res.write('retry: 2000\n\n');

        // Send event messages
        let interval = setInterval(async () => {
            // Query results and send it
            const id = req.params.id;
            const poll = await Poll.query().withGraphFetched('choices').findById(id);
            res.write(`data: ${JSON.stringify(poll)}\n\n`);
            console.log('SSE send');
        }, 1000);

        // Check if the client left
        res.on('close', () => {
            console.log('SSE done');
            clearInterval(interval);
            res.end();
        });
    },


    //
    // PATCH /api/polls/{id}
    // Given a selection of choices, update the votes of a given poll
    //
    updateValidator: [
        body('choices')
            .exists().withMessage('choices is required')
            .isArray().withMessage('choices should be an array'),
        body('choices.*')
            .isString().withMessage('choices should only contain strings'),

        body('openEndedResponses')
            .exists().withMessage('openEndedResponses is required')
            .isArray().withMessage('openEndedResponses should be an array'),
        body('openEndedResponses.*')
            .isString().withMessage('openEndedResponses should only contain strings')
    ],

    async update(req, res) {
        // Check validation rules
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        const data = req.body;

        try {
            // Create open ended answer objects
            data.openEndedResponses.forEach(async answer => {
                // Check if choice already exists
                const matchingChoices = await Poll.relatedQuery('choices').for(id).where('text', answer);
                if (matchingChoices.length > 0) {
                    // Choice exists, increment it
                    await Poll.relatedQuery('choices').for(id).where('text', answer).increment('votes', 1);
                } else {
                    // Otherwise, create a new choice with 1 vote
                    const choice = { text: answer, votes: 1 };
                    await Poll.relatedQuery('choices').for(id).insert(choice);
                }
                // Increment total votes
                await Poll.query().findById(id).increment('totalVotes', 1);
            });

            // Update normal choices
            await Poll.relatedQuery('choices').for(id).where('text', 'in', data.choices).increment('votes', 1);
            await Poll.query().findById(id).increment('totalVotes', data.choices.length);
            res.sendStatus(200);
        } catch (err) {
            console.log(err.message);
            res.sendStatus(400);
        }
    },


    //
    // DELETE /api/polls/{id}
    // Remove a single poll from the database
    //
    async destroy(req, res) {
        try {
            const id = req.params.id;
            await Poll.query().findById(id).delete();
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
};

module.exports = Polls;
