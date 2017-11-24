exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, email: 'a@a', phone_number:'778'}),
        knex('users').insert({id: 2, email: 'b@b', phone_number:'555'}),
        knex('users').insert({id: 3, email: 'connie@gmail.com'})
      ]);
    });
};