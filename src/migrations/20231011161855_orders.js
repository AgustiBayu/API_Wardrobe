/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('orders', function(table){
        table.increments('order_id').primary();
        table.string('customer_name').notNullable();
        table.date('order_date').notNullable();
        table.integer('total_amount').notNullable();
        table.integer('customer_id').unsigned();
        table.foreign('customer_id').references('customer_id').inTable('customers')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('orders')
};
