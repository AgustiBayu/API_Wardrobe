/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('order_payments', function(table) {
        table.increments('payment_id').primary();
        table.integer('order_id').unsigned();
        table.integer('payment_amount').notNullable();
        table.date('payment_date').notNullable();
        table.foreign('order_id').references('order_id').inTable('orders')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('order_payments')
};
