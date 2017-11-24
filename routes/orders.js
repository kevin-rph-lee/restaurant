"use strict";

const express = require('express');
const router  = express.Router();


var twilio = require('twilio');
var client = require('twilio')('AC0945be5576dc3b770424a16a6ac748e7', '73304938e2cff076c3f2c4342b1aa6ba');
const MessagingResponse = twilio.twiml.MessagingResponse;


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

  router.get("/time/:id", (req, res) => {
      knex.select("*")
          .from("orders")
          // .outerJoin('ordered_items', 'orders.id', 'ordered_items.order_id')
          .then((result) => {
            res.render('time');
          });
      // knex db query
      // if wait time 20 min // id number order id
/*      knex.select("wait_time").from("orders").where({})*/
    });



  router.get("/", (req, res) => {
    knex
      .select("orders.id", "ordered_items.quantity", "ordered_items.paid_price", "menu_items.name", "orders.wait_time")
      .from("orders")
      .innerJoin('ordered_items', 'orders.id', 'ordered_items.order_id')
      .innerJoin('menu_items', 'menu_item_id', "menu_items.id")
      .then((results) => {
        res.json(results);
    });
  });





  // router.post("/test", (req, res) => {
  //   console.log("burgers: " + req.body.burgers);
  //   console.log('fries: ' + req.body.fries);
  //   console.log('shakes: ' + req.body.shakes);
  // });
    //untested
  router.post("/", (req, res) => {
    console.log('Getting post request...');
    console.log("burgers: " + req.body.burgers);
    console.log('fries: ' + req.body.fries);
    console.log('shakes: ' + req.body.shakes);
    knex
      .insert({user_id: 1, wait_time: 0})
      .into("orders")
      .returning('id')
      .then(order_id => {

        return new Promise((resolve, reject) => {
          if(req.body.burgers > 0){
            console.log('inserting burgers');
            knex
              .insert({order_id: Number(order_id), menu_item_id: 1, quantity: req.body.burgers, paid_price: 999})
              .into("ordered_items")
              .then(()=>{});
          }
          if(req.body.fries > 0){
            console.log('inserting fries');
            knex
              .insert({order_id: Number(order_id), menu_item_id: 2, quantity: req.body.fries, paid_price: 999})
              .into("ordered_items")
              .then(()=>{});
          }
          if(req.body.shakes > 0){
            console.log('inserting shakes');
            knex
              .insert({order_id: Number(order_id), menu_item_id: 3, quantity: req.body.shakes, paid_price: 999})
              .into("ordered_items")
              .then(()=>{});
          }
          resolve(order_id)
        })
      }).then((order_id) => {
        console.log("about to send text message");
        // let [order_id, burger, shake] = result;
        // console.log("order_id we'll give to SMS: ", typeof id, JSON.stringify(order_id));
        client.messages.create({
          from: '+16046708224',
          to: '+17789388262',
          body: `Order ID ${order_id} Burgers ${req.body.burgers} Fries ${req.body.fries} Shakes ${req.body.shakes}`
        }, (error, message) => {
          // console.log(message);
        })
        res.json(order_id);
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  });


  router.post("/SMS", (req, res) => {
    console.log('Recieving SMS message');
    const twiml = new MessagingResponse();
    const body = req.body['Body'].split(' ')
    console.log("ID: " + body[0] + " Time: " + body[1]);
    twiml.message('Testing');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  });


  return router;
}
