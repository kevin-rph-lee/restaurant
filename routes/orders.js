"use strict";

const express = require('express');
const router  = express.Router();


var twilio = require('twilio');
var client = require('twilio')('ACd653fcd7492c6b800652c1d0e52f8bc2', 'be46e5d7feca518f58e24777507cdeea');
const MessagingResponse = twilio.twiml.MessagingResponse;


module.exports = (knex) => {

  function getPhoneNumber(user_id){
    console.log('Getting phone#');

  }

  router.get("/:id", (req, res) => {
    knex
      .select("*")
      .from("orders")
      .where('id', req.params.id)
      .then((results) => {
        res.render("orderinfo", {order : results}});

    });
  });

  router.get("/info/:id", (req, res) => {
      knex.select("orders.id","menu_items.name", "ordered_items.quantity", "menu_items.price", "orders.wait_time")
          .from("orders")
          .where('orders.id', req.params.id)
          .innerJoin('ordered_items', 'orders.id', 'ordered_items.order_id')
          .innerJoin('menu_items', 'menu_item_id', "menu_items.id")
          .then((result) => {
            res.json(result);
          });
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
          from: '+16046708301',
          to: '+17789902233',
          body: `Order ID ${order_id} Burgers ${req.body.burgers} Fries ${req.body.fries} Shakes ${req.body.shakes}`
        }, (error, message) => {
          knex.select("phone_number")
            .from("users")
            .where('orders.id', Number(order_id))
            .innerJoin('orders', 'users.id', 'orders.user_id')
            .then((result) => {
              const customerPhoneNumber = '+' + result[0]['phone_number'];
              console.log('Phone number ' + customerPhoneNumber);
              client.messages.create({
                from: '+16046708301',
                to: customerPhoneNumber,
                body: `Your order id is: ${order_id}`
              }, (error, message) => {
              console.log('Sent message... i hope');
              })
            });
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
    let message = 'Default message';
    if(body[1] === 'ready'){
      message = `Your order is ready.`

     console.log('Message is: ', message);
    knex('orders')
      .where('id', body[0])
      .update({
        wait_time: 0
      }).then(()=>{
        knex.select("phone_number")
        .from("users")
        .where('orders.id', body[0])
        .innerJoin('orders', 'users.id', 'orders.user_id')
        .then((result) => {
          const customerPhoneNumber = '+' + result[0]['phone_number'];
          console.log('Phone number ' + customerPhoneNumber);
          client.messages.create({
            from: '+16046708301',
            to: customerPhoneNumber,
            body: message
          }, (error, message) => {
          console.log('Sent message... i hope');
          })
        });
      })
    } else {
      message =  `order id: ${body[0]}, new wait time: ${body[1]}`
     console.log('Message is: ', message);
    knex('orders')
      .where('id', body[0])
      .update({
        wait_time: Number(body[1])
      }).then(()=>{
        knex.select("phone_number")
        .from("users")
        .where('orders.id', body[0])
        .innerJoin('orders', 'users.id', 'orders.user_id')
        .then((result) => {
          const customerPhoneNumber = '+' + result[0]['phone_number'];
          console.log('Phone number ' + customerPhoneNumber);
          client.messages.create({
            from: '+16046708301',
            to: customerPhoneNumber,
            body: message
          }, (error, message) => {
          console.log('Sent message... i hope');
          })
        });
      });
    twiml.message('Message recieved');
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());

    }


  });

  console.log(getPhoneNumber(1));


  return router;
}
