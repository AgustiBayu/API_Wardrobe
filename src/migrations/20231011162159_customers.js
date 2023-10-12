/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('customers', function(table){{
        table.increments('customer_id').primary();
        table.string('customer_name').notNullable();
        table.string('email').notNullable();
        table.string('phone_number').notNullable();
    }})
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('customers')
};
