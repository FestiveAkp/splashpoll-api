const { Model } = require('objection');

class Choice extends Model {
    static get tableName() {
        return 'choices';
    }

    static get relationMappings() {
        const Poll = require('./Poll');

        return {
            polls: {
                relation: Model.BelongsToOneRelation,
                modelClass: Poll,
                join: {
                    from: 'choices.poll_id',
                    to: 'polls.id'
                }
            }
        };
    }
}

module.exports = Choice;
