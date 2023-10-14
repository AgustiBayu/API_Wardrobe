/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  return knex('customers').insert([
    { customer_id: 1, customer_name: 'Fajar', email: 'fajar@gmail.com', phone_number: '087456089098' },
    { customer_id: 2, customer_name: 'Lukman', email: 'lukman@gmail.com', phone_number: '087888713200' },
    { customer_id: 3, customer_name: 'Tera', email: 'tera@gmail.com', phone_number: '082008739722' },
    { customer_id: 4, customer_name: 'Reka', email: 'reka@gmail.com', phone_number: '082450589331' },
  ])
};
