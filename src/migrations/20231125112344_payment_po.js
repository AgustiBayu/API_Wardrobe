/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('payment_po', function(table){
        table.increments('paymentPO_id').primary();
        table.integer('orderPO_id').unsigned();
        table.integer('supplier_id').unsigned();
        table.integer('total').nullable().defaultTo(0);
        table.string('bank').notNullable();
        table.date('tanggal').notNullable();
        table.string('payment_status').notNullable();
        table.foreign('orderPO_id').references('orderPO_id').inTable('purchase_orders')
        table.foreign('supplier_id').references('supplier_id').inTable('suppliers')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('payment_po')
};
