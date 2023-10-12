/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('suppliers', function(table){
        table.increments('supplier_id').primary();
        table.string('supplier_name').notNullable();
        table.string('contact_name').notNullable();
        table.string('email').notNullable();
        table.string('phone_number').notNullable
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('suppliers')
};
