CREATE TABLE orders (
  id SERIAL PRIMARY KEY not null,
  user_id INTEGER,
);

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY not null,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(50),
  price MONEY
);


CREATE TABLE ordered_items (
  id SERIAL PRIMARY KEY not null,
  order_id INTEGER NOT NULL,
  menu_item_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  paid_price MONEY NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  email VARCHAR(50) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL
);

