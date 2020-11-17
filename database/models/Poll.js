const { Model } = require('objection');

class Poll extends Model {
    static get tableName() {
        return 'polls';
    }

    static get relationMappings() {
        const Choice = require('./Choice');

        return {
            choices: {
                relation: Model.HasManyRelation,
                modelClass: Choice,
                join: {
                    from: 'polls.id',
                    to: 'choices.poll_id'
                }
            }
        };
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['question', 'openEnded', 'multipleChoices'],

            properties: {
                id: { type: 'string' },
                question: { type: 'string' },
                openEnded: { type: 'boolean' },
                multipleChoices: { type: 'boolean' },
                // answers: {
                //     type: 'object'
                // }
            },

            // definitions: {
            //     answer: {
            //         type: 'object',
            //         required: ['text', 'votes'],
            //         properties: {
            //             text: { type: 'string' },
            //             votes: { type: 'number' }
            //         }
            //     }
            // }
        }
    }
}

module.exports = Poll;
