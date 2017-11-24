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
    res.render('time', {
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
    //Getting user ID
    // const userID = knex.select("id").from("users").where('email', req.params.email);

    knex
      .insert({user_id: 1})
      .into("orders")
      .returning('id')
      .then(order_id => {
        // const burger_promise = (num_burgers_ordered > 0 ?
        //   knex.insert({}).into('ordered_items') :     //...... finish this
        //   undefined);
        // const shake_promise = knex.insert({}).into('ordered_items'); //...... finish this
        // burger-inserting code
        // shake-inserting code
        // fries-inserting code
        // Promise.all([order_id, burger_promise, shake_promise])
        return order_id;
      })
      .then((result) => {
        let [order_id, burger, shake] = result;
        console.log("order_id we'll give to SMS: ", typeof id, JSON.stringify(order_id));
        client.messages.create({
          from: '+16046708224',
          to: '+17789388262',
          body: "Your order ID # is: " + order_id
        }, (error, message) => {
          console.log(message);
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
