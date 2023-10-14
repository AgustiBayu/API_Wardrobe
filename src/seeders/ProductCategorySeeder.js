/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  return knex('product_categories').insert([
    { category_id: 1, category_name: 'Kaos' },
    { category_id: 2, category_name: 'Celana' },
    { category_id: 3, category_name: 'Kemeja' },
  ])
};
