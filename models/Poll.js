const { Model } = require('objection');

class Poll extends Model {
    static get tableName() {
        return 'polls';
    }
}

module.exports = { Poll };
