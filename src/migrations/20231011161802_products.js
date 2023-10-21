/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('products', function(table){
        table.increments('product_id').primary();
        table.string('product_name').notNullable();
        table.integer('category_id').unsigned();
        table.integer('price').notNullable();
        table.string('image').notNullable();
        table.string('description').notNullable();
        table.date('created_at ').notNullable();
        table.foreign('category_id').references('category_id').inTable('product_categories');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('products')
};
