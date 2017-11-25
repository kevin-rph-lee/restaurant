"use strict";

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');
const cookieSession = require('cookie-session');

var twilio = require('twilio');
var client = require('twilio')('AC0945be5576dc3b770424a16a6ac748e7', '73304938e2cff076c3f2c4342b1aa6ba');
const MessagingResponse = twilio.twiml.MessagingResponse;


// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");
const orderedItemsRoutes = require("./routes/ordered_items");
const menuItemsRoutes = require("./routes/menu_items");


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/users", usersRoutes(knex));
app.use("/orders", ordersRoutes(knex));
app.use("/ordered_items", orderedItemsRoutes(knex));
app.use("/menu_items", menuItemsRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index", {output : undefined});
});

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000
}));


if(ENV === 'development') {
  app.get("/login/:id", (request, response) => {
    request.session.user_id = request.params.id;
    response.redirect("/")
  })
}

if(ENV === 'development') {
  app.get("/logout", (request, response) => {
    request.session.user_id = null;
    response.redirect("/")
  })
}


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
