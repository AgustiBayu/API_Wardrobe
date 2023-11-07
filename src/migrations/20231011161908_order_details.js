/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('order_details', function(table){
        table.increments('detail_id').primary();
        table.integer('order_id').unsigned();
        table.integer('product_id').unsigned();
        table.integer('quantity').notNullable();
        table.integer('unit_price').notNullable();
        table.string('status').notNullable();
        table.foreign('order_id').references('order_id').inTable('orders');
        table.foreign('product_id').references('product_id').inTable('products')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('order_details');
};
