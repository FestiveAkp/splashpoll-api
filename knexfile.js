module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'splashpoll',
      username: 'akash',
      password: 'asdf'
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: './database/migrations'
      }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: 'knex_migrations',
      directory: './database/migrations'
    }
  }
};
