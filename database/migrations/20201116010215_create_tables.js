exports.up = knex => {
    return knex.schema
        .createTable('polls', table => {
            table.string('id', 10).primary();
            table.string('question').notNullable();
            table.boolean('openEnded').notNullable();
            table.boolean('multipleChoices').notNullable();
            table.integer('totalVotes').notNullable();
            table.timestamps(false, true);
        })
        .createTable('choices', table => {
            table.increments('id').primary();
            table.string('poll_id', 10).references('id').inTable('polls').notNullable().onDelete('cascade');
            table.string('text').notNullable();
            table.integer('votes').notNullable();
        });
};

exports.down = knex => {
    return knex.schema
        .dropTable('choices')
        .dropTable('polls');
};
