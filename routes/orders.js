"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {


  router.get("/:id", (req, res) => {
    knex
      .select("*")
      .from("orders")
      .where('id', req.params.id)
      .then((results) => {
        res.json(results);
    });
  });

  router.get("/", (req, res) => {
    knex
      .select("orders.id", "ordered_items.quantity", "ordered_items.paid_price", "menu_items.name")
      .from("orders")
      .innerJoin('ordered_items', 'orders.id', 'ordered_items.order_id')
      .innerJoin('menu_items', 'menu_item_id', "menu_items.id")
      .then((results) => {
        res.json(results);
    });
  });


    //untested
  router.post("/", (req, res) => {
    console.log('Getting post request...');

    knex
      .insert({user_id: 1})
      .into("orders")
      .returning('id')
      .then((id) => {
        console.log(id);
        res.end()})
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  });

//midterm=# SELECT orders.id, ordered_items.paid_price, menu_items.name, ordered_items.quantity FROM orders JOIN ordered_items ON order_id = orders.id JOIN menu_items ON menu_item_id = menu_items.id WHERE orders.id =1;


  //untested
  // router.post("/", (req, res) => {
  //   console.log('Getting post request...');

  //   knex
  //     .insert({phone_number: req.body.phone, firstName: req.body.firstName, last_name: req.body.firstName, email: req.body.email})
  //     .into("users")
  //     .then(()=>res.end())
  //     .catch(error => {
  //       res.status(500).json({ message: error.message });
  //     });
  // });

  return router;
}
