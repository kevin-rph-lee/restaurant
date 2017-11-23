"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {


  router.get("/price/:id", (req, res) => {
    knex
      .select("price")
      .from("menu_items")
      .where('id', req.params.id)
      .then((results) => {
        res.json(results);
    });
  });

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("menu_items")
      .then((results) => {
        res.json(results);
    });
  });


  //untested
  // router.post("/", (req, res) => {
  //   console.log('Getting post request...');

  //   knex
  //     .insert({order_id: 1, menu_item_id: 1, quantity: 3, paid_price: 500})
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
