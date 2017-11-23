exports.up = function(knex, Promise) {
  return knex.schema.createTable('orders', function(table) {
    table.increments();
    table.integer('user_id');
  });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('orders');
};
