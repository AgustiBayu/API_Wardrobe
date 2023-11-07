/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('product_stocks', function(table){
        table.increments('stock_id').primary();
        table.integer('product_id').unsigned();
        table.string('size').notNullable();
        table.string('color').notNullable();
        table.integer('stock_quantity').notNullable().defaultTo(0);
        table.foreign('product_id').references('product_id').inTable('products');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('product_stocks')
};
