exports.seed = function(knex, Promise) {
  return knex('menu_items').del()
    .then(function () {
      return Promise.all([
       knex('menu_items').insert({id: 1, name: 'Hamburger', description: 'YUM', price: 500}),
       knex('menu_items').insert({id: 2, name: 'Fries', description: 'YEY!', price: 300})
      ]);
    });
};