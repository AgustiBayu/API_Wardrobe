// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      user: "root",
      password: "",
      database: "wardrobe",
      port: "3306",
      host: "localhost",
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/migrations",
    },
    seeds: {
      directory: "./src/seeders",
    },
  },

  staging: {
    client: "mysql2",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "mysql2",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
