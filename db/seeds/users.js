exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, email: 'connie@gmail.com', phone_number:'17789388262'})
      ]);
    });
};