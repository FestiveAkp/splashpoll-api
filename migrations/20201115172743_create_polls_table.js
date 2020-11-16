exports.up = knex => {
    return knex.schema.createTable('polls', table => {
        table.string('id', 12).primary();
        table.string('question').notNullable();
        table.jsonb('answers');
        table.timestamps(false, true);
    });
};

exports.down = knex => {
    return knex.schema.dropTable('polls');
};
