/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
    return knex('suppliers').insert([
      {supplier_id: 1, supplier_name: 'Mogas', contact_name: 'Agusti', email: 'agusti@gmail.com', phone_number: '081330789098'},
      {supplier_id: 2, supplier_name: 'A-One', contact_name: 'Jecky', email: 'jecky@gmail.com', phone_number: '087888789098'},
      {supplier_id: 3, supplier_name: 'Tinystyles', contact_name: 'Ali', email: 'Ali@gmail.com', phone_number: '082111789722'},
      {supplier_id: 4, supplier_name: 'Kidsy', contact_name: 'Hanjaya', email: 'hanjaya@gmail.com', phone_number: '082000789331'},
    ])
};
