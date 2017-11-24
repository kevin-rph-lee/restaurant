exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, email: 'a@a', phone_number:'7785553333'}),
        knex('users').insert({id: 2, email: 'b@b', phone_number:'15558889999'}),
        knex('users').insert({id: 3, email: 'connie@gmail.com', phone_number:'17789388262'})
      ]);
    });
};