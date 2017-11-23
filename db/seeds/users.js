exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, email: 'a@a', phone_number:'778',first_name: 'Dave',  last_name: 'Smith'}),
        knex('users').insert({id: 2, email: 'b@b', phone_number:'555',first_name: 'Sam', last_name: 'Lee'}),
      ]);
    });
};