'use strict';

const express = require('express');
const router  = express.Router();
const twilio = require('twilio');
const client = require('twilio')('ACd653fcd7492c6b800652c1d0e52f8bc2', 'be46e5d7feca518f58e24777507cdeea');
const MessagingResponse = twilio.twiml.MessagingResponse;
const restaurantNumber = '+17789902233';
const twilioNumber = '+16046708301';


module.exports = (knex) => {


  /**
   * Sends a text message
   * @param  {[String]} to      Phone # that the SMS is going to
   * @param  {[String]} message Message body
   */
  function sendSMS(to, message){
    client.messages.create({
      from: twilioNumber,
      to: to,
      body: message
    }, (error, message) => {
      console.log('Sent message... i hope');
    });
  }


  router.get('/:id', (req, res) => {
    knex.select('orders.id', 'menu_items.name', 'ordered_items.quantity', 'menu_items.price', 'orders.wait_time', 'ordered_items.paid_price')
      .from('orders')
      .where('orders.id', req.params.id)
      .innerJoin('ordered_items', 'orders.id', 'ordered_items.order_id')
      .innerJoin('menu_items', 'menu_item_id', 'menu_items.id')
      .then((results) => {
        let totalPrice = 0;
        for(let i = 0; i < results.length; i ++){
          totalPrice += results[i]['paid_price'];
        }
        // console.log('Total Price: ' + totalPrice);
        res.render('orderinfo', {order: results, totalPrice: totalPrice});
        // res.json(results);
      });
  });


  router.get('/', (req, res) => {
    knex
      .select('orders.id', 'ordered_items.quantity', 'ordered_items.paid_price', 'menu_items.name', 'orders.wait_time')
      .from('orders')
      .innerJoin('ordered_items', 'orders.id', 'ordered_items.order_id')
      .innerJoin('menu_items', 'menu_item_id', 'menu_items.id')
      .then((results) => {
        res.json(results);
    });
  });

  router.post('/', (req, res) => {
    console.log('Getting post request...');
    console.log('burgers: ' + req.body.burgers);
    console.log('fries: ' + req.body.fries);
    console.log('shakes: ' + req.body.shakes);

    knex
      .select('price')
      .from('menu_items')
      .then((prices) =>{

        // console.log("rohit");
        // for(var i = 0; i<price.length; i++){
        //   console.log("price :"+price[i].price);
        // }
        // console.log(JSON.stringify(price));
        // const prices = JSON.stringify(price);
        const burgersPrice = prices[0]['price'];
        const friesPrice = prices[1]['price'];
        const shakesPrice = prices[2]['price'];
        const burgersQuantity = req.body.burgers;
        const friesQuantity = req.body.fries;
        const shakesQuantity = req.body.shakes;
        // console.log('Prices: ' + burgerPrice, friesPrice, shakePrice);

        knex
          .insert({user_id: 1, wait_time: null})
          .into('orders')
          .returning('id')
          .then(order_id => {
            return new Promise((resolve, reject) => {
              if(req.body.burgers > 0){
                console.log('inserting burgers');
                knex
                  .insert({order_id: Number(order_id), menu_item_id: 1, quantity: burgersQuantity, paid_price: (burgersPrice * burgersQuantity)})
                  .into('ordered_items')
                  .then(()=>{});
              }
              if(req.body.fries > 0){
                console.log('inserting fries');
                knex
                  .insert({order_id: Number(order_id), menu_item_id: 2, quantity: friesQuantity, paid_price: (friesPrice * friesQuantity)})
                  .into('ordered_items')
                  .then(()=>{});
              }
              if(req.body.shakes > 0){
                console.log('inserting shakes');
                knex
                  .insert({order_id: Number(order_id), menu_item_id: 3, quantity: shakesQuantity, paid_price: (shakesPrice * shakesQuantity)})
                  .into('ordered_items')
                  .then(()=>{});
              }
              resolve(order_id);
            });
          }).then((order_id) => {
            console.log('about to send text message');
            sendSMS(restaurantNumber, `Order ID ${order_id} Burgers ${req.body.burgers} Fries ${req.body.fries} Shakes ${req.body.shakes}`);
            knex.select('phone_number')
                .from('users')
                .where('orders.id', Number(order_id))
                .innerJoin('orders', 'users.id', 'orders.user_id')
                .then((result) => {
                  const customerPhoneNumber = '+' + result[0]['phone_number'];
                  // console.log('Phone number ' + customerPhoneNumber);
                  sendSMS(customerPhoneNumber, `Your order id is: ${order_id}`);
                });

            res.json(order_id);
          })
          .catch(error => {
            res.status(500).json({ message: error.message });
          });
      });

  });

  /**
   * Recieving an SMS message from the restaurant.
   * Message format MUST be in the format of '<order di> <wait time>'
   * Wait
   */
  router.post('/SMS', (req, res) => {
    console.log('Recieving SMS message');
    // const twiml = new MessagingResponse();
    const body = req.body['Body'].split(' ');
    console.log('ID: ' + body[0] + ' Time: ' + body[1]);
    const orderID = body[0];
    const waitTime = body[1];
    let message = 'Default message';


    //Checking message format
    if( (body[1] === undefined) || (isNaN(body[0])) ){
      sendSMS(restaurantNumber, 'Incorrect message format: please send messages like <ORDER ID> <Wait time/Ready>');
      return;
    }

    knex
      .select('*')
      .where({id: Number(orderID)})
      .from('orders')
      .then((result) =>{
        console.log("Result: ", result);
        //Checks if the order exists in the DB
        if(result.length === 0){
          sendSMS(restaurantNumber, 'Error: Order does not exist');
        } else if (waitTime === 'ready'){
          console.log('Message is: ', message);
          knex('orders')
            .where('id', orderID)
            .update({wait_time: 0})
            .then(()=>{
              knex.select('phone_number')
                .from('users')
                .where('orders.id', orderID)
                .innerJoin('orders', 'users.id', 'orders.user_id')
                .then((result) => {
                  const customerPhoneNumber = '+' + result[0]['phone_number'];
                  console.log('Phone number ' + customerPhoneNumber);
                  sendSMS(customerPhoneNumber, `Your order: ${orderID} is ready to pickup.`);
                });
            });
        } else {
          console.log('Message is: ', message);
          knex('orders')
            .where('id', orderID)
            .update({wait_time: Number(waitTime)})
            .then(()=>{
              knex.select('phone_number')
                .from('users')
                .where('orders.id', orderID)
                .innerJoin('orders', 'users.id', 'orders.user_id')
                .then((result) => {
                  const customerPhoneNumber = '+' + result[0]['phone_number'];
                  console.log('Phone number ' + customerPhoneNumber);
                  sendSMS(customerPhoneNumber, `order id: ${orderID}, new approx. wait time: ${waitTime} minutes`);
                });
            });
          res.sendStatus(200);
        }
      })

  });
  return router;
};
