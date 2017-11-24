exports.up = function(knex, Promise) {
  return knex.schema.createTable('menu_items', function(table) {
    table.increments();
    table.string('name');
    table.integer('price');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('menu_items');
};

