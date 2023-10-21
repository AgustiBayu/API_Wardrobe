/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('material_products', function(table){
        table.increments('material_products_id').primary();
        table.integer('material_id').unsigned();
        table.integer('product_id').unsigned();
        table.string('satuan').notNullable();
        table.integer('jumlah').notNullable();
        table.foreign('material_id').references('material_id').inTable('materials');
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
