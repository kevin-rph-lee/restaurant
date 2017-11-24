exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, email: 'a@a', phone_number:'778',first_name: 'Dave',  last_name: 'Smith'}),
        knex('users').insert({id: 2, email: 'b@b', phone_number:'555',first_name: 'Sam', last_name: 'Lee'}),
        knex('users').insert({id: 3, email: 'connie@gmail.com', phone_number:'17789388262', first_name: 'Connie', last_name: 'Choi'})
      ]);
    });
};