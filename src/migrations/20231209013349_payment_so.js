/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('payment_so', function(table){
        table.increments('paymentSO_id').primary();
        table.integer('order_id').unsigned();
        table.integer('customer_id').unsigned();
        table.integer('total').nullable().defaultTo(0);
        table.string('bank').nullable();
        table.date('tanggal').notNullable();
        table.string('payment_status').notNullable();
        table.foreign('order_id').references('order_id').inTable('orders')
        table.foreign('customer_id').references('customer_id').inTable('customers')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('payment_so')
};