'use strict';

const express = require('express');
const router  = express.Router();
const twilio = require('twilio');
const client = require('twilio')(process.env.TWILIOACCOUNTSID, process.env.TWILIOAUTHTOKEN);
const MessagingResponse = twilio.twiml.MessagingResponse;
const restaurantNumber = process.env.RESTAURANTNUMBER;
const twilioNumber = process.env.TWILIONUMBER;


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
    }, (error, message) => {});
  }

  /**
   * Changes the price of menu items based off parameters passed to it
   * @param  {STRING} item   'B' is Burger, 'F' is fries, 'S' is shakes
   * @param  {[INTEGER]} amount New Price
   */
  function changePrice(item, amount){
    //Error checking to see if we recieved data in the right format
    console.log('checking to change price');
    if (amount < 0){
      sendSMS(restaurantNumber, 'Amount cannot be less than 0!');
    } else if(isNaN(amount)){
      sendSMS(restaurantNumber, 'Error! No new price provided!');
    } else if (item === 'B'){
      console.log('Updating burger amount');
      knex('menu_items')
        .where('name', 'Hamburger')
        .update({price: Number(amount)})
        .then(()=>{});
    } else if (item === 'F') {
      console.log('Updating fries amount');
      knex('menu_items')
        .where('name', 'Fries')
        .update({price: Number(amount)})
        .then(()=>{});
    } else if (item === 'S') {
      console.log('Updating shakes amount');
      knex('menu_items')
        .where('name', 'Shakes')
        .update({price: Number(amount)})
        .then(()=>{});
    } else {
      sendSMS(restaurantNumber, 'Error! Item not found!');
    }
  }

  //Redircts to the orderinfo.ejs page which provides the customer with order info
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
        console.log(results);
        return res.render('orderinfo', {order: results, totalPrice: totalPrice});
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

  //Submitting a new order
  router.post('/', (req, res) => {
    knex
      .select('name', 'price')
      .from('menu_items')
      //Getting current prices from the menu_items table
      .then((prices) =>{
        let burgersPrice = 0;
        let friesPrice = 0;
        let shakesPrice = 0;
        //Setting prices
        for(var i = 0; i < prices.length; i ++){
          if(prices[i]['name'] === 'Hamburger'){
            burgersPrice = prices[i]['price'];
          } else if(prices[i]['name'] === 'Fries'){
            friesPrice = prices[i]['price'];
          } else if(prices[i]['name'] === 'Shakes'){
            shakesPrice = prices[i]['price'];
          } else {
            console.log('Error!');
          }
        }
        const burgersQuantity = req.body.burgers;
        const friesQuantity = req.body.fries;
        const shakesQuantity = req.body.shakes;
        //Checking if the customer has left any notes for the restaurant
        let customerNotes = '';
        if(!req.body.notes){
          customerNotes = null;
        } else {
          customerNotes = req.body.notes;
        }
        //updating DB
        knex
          .insert({user_id: 1, wait_time: null, customer_notes: customerNotes})
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
            //Notifying restaurant of new order (msg depends if there is a customer note or not)
            console.log('about to send text message');
            if(!customerNotes){
              sendSMS(restaurantNumber, `Order ID ${order_id} Burgers ${burgersQuantity} Fries ${friesQuantity} Shakes ${shakesQuantity}`);
            } else{
              sendSMS(restaurantNumber, `Order ID ${order_id} Burgers ${burgersQuantity} Fries ${friesQuantity} Shakes ${shakesQuantity} Customer notes: ${customerNotes}`);
            }
            //Getting customer phone # and notifying customer
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
   * If providing wait time or rdy nodification MUST be in the format of '<order id> <wait time>'
   * If updating new price, notification MUST be in the format of <b/f/s> <price>
   * Only recieves messages from restaurant phone.
   */
  router.post('/SMS', (req, res) => {
    const body = req.body['Body'].split(' ');
    const orderID = body[0];
    const waitTime = body[1];
    let message = 'Default message';
    console.log('EVERYTHING IS FINE');
    //Checking if we're getting a message from the restaurant
    if(req.body.From !== restaurantNumber){
      console.log('Access denied, unknown number');
    }
    //Messages routed here if the restaurant owner wants to change the price of the products
    if(orderID === 'B' || orderID === 'F' || orderID === 'S'){
      console.log('Chaing price');
      changePrice(orderID, waitTime);
      return;
    }
    //Checking message format
    if(waitTime === undefined || isNaN(orderID) || (isNaN(waitTime) && waitTime !== 'ready') || waitTime < 1){
      sendSMS(restaurantNumber, 'Incorrect message format: please send messages like <ORDER ID> <Wait time/Ready>');
      return;
    }
    knex
      .select('*')
      .where({id: Number(orderID)})
      .from('orders')
      .then((result) =>{
        //Checks if the order exists in the DB. Sends error message if not
        if(result.length === 0){
          sendSMS(restaurantNumber, 'Error: Order does not exist');
        //If order is ready, set wait time to 0 and notify customer
        } else if (waitTime === 'ready'){
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
        //Set wait time to what the owner has provided and notify customer
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
      });
  });
  return router;
};
