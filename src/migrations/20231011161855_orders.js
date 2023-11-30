/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('orders', function(table){
        table.increments('order_id').primary();
        table.integer('customer_id').unsigned();
        table.integer('product_id').unsigned();
        table.integer('quantity_demand').notNullable();
        table.integer('quantity_receive').nullable().defaultTo(0);
        table.integer('total').notNullable();
        table.date('order_date').notNullable();
        table.string('order_status').notNullable();
        table.string('payment_status').notNullable();
        table.foreign('customer_id').references('customer_id').inTable('customers')
        table.foreign('product_id').references('product_id').inTable('products')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('orders')
};
