module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'splashpoll',
      username: 'akash',
      password: 'asdf'
    }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    // pool: {
    //   min: 2,
    //   max: 10
    // },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
