/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('material_products', function(table){
        table.increments('material_products_id').primary();
        table.integer('materials_id').unsigned();
        table.integer('product_id').unsigned();
        table.integer('satuan').notNullable();
        table.foreign('materials_id').references('materials_id').inTable('meterials');
        table.foreign('product_id').references('product_id').inTable('products');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('material_products');
};
