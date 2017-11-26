exports.up = function(knex, Promise) {
  return knex.schema.createTable('orders', function(table) {
    table.increments();
    table.integer('user_id');
    table.integer('wait_time');
    table.string('customer_notes');
  });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('orders');
};
