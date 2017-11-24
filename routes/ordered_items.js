"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {


  // router.get("/:id", (req, res) => {
  //   knex
  //     .select("*")
  //     .from("ordered_items")
  //     .where('id', req.params.id)
  //     .then((results) => {
  //       res.json(results);
  //   });
  // });

  // router.get("/", (req, res) => {
  //   knex
  //     .select("*")
  //     .from("ordered_items")
  //     .then((results) => {
  //       res.json(results);
  //   });
  // });

  return router;
}
