"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {


  // router.get("/:email", (req, res) => {
  //   knex
  //     .select("*")
  //     .from("users")
  //     .where('email', req.params.email)
  //     .then((results) => {
  //       res.json(results);
  //   });
  // });

  // router.get("/", (req, res) => {
  //   knex
  //     .select("*")
  //     .from("users")
  //     .then((results) => {
  //       res.json(results);
  //   });
  // });


  router.post("/test", (req, res) => {
    console.log("burgers: " + req.body.burgers);
    console.log('fries: ' + req.body.fries);
    console.log('shakes: ' + req.body.shakes);
  });



  // //untested
  // router.post("/", (req, res) => {
  //   console.log('Getting post request...');

  //   knex
  //     .insert({phone_number: '911', first_name: 'test1', last_name: 'test2', email: 'test@test.com'})
  //     .into("users")
  //     .returning('id')
  //     .then((id) => {
  //       console.log(id);
  //       res.end()})
  //     .catch(error => {
  //       res.status(500).json({ message: error.message });
  //     });
  // });


  return router;
}
