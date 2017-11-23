exports.up = function(knex, Promise) {
  return knex.schema.createTable('ordered_items', function(table) {
    table.increments();
    table.integer('order_id');
    table.integer('menu_item_id');
    table.integer('quantity');
    table.integer('paid_price');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ordered_items');
};
