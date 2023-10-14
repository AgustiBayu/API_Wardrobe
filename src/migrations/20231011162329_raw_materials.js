/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('materials', function(table){
        table.increments('material_id').primary();
        table.string('material_name').notNullable();
        table.integer('supplier_id').unsigned();
        table.integer('price').notNullable();
        table.integer('quantity_in_stock').notNullable();
        table.foreign('supplier_id').references('supplier_id').inTable('suppliers')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
