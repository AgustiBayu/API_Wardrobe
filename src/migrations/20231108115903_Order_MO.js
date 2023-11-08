/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('order_mo', function(table){
        table.increments('orderMO_id').primary();
        table.integer('product_id').unsigned();
        table.integer('quantity').notNullable();
        table.integer('total').notNullable();
        table.string('status').notNullable();
        table.date('tanggal').notNullable();
        table.foreign('product_id').references('product_id').inTable('products')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('order_mo')
};
