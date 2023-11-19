/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('purchase_orders', function(table){
        table.increments('orderPO_id').primary();
        table.integer('supplier_id').unsigned();
        table.integer('material_id').unsigned();
        table.integer('quantity_demand').notNullable();
        table.integer('quantity_receive').nullable().defaultTo(0);
        table.integer('total').notNullable();
        table.date('tanggal').notNullable();
        table.string('order_status').notNullable();
        table.string('payment_status').notNullable();
        table.foreign('supplier_id').references('supplier_id').inTable('suppliers')
        table.foreign('material_id').references('material_id').inTable('materials')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('purchase_orders')
};
