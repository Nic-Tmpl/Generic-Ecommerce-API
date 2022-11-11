const { Client } = require('pg');
const { DB } = require('./config');

(async () => {

  const usersTableStmt = `
    CREATE TABLE IF NOT EXISTS users (
      id              UUID DEFAULT gen_random_uuid()  PRIMARY KEY NOT NULL,
      password        VARCHAR,
      email           VARCHAR(50),      
      first_name      VARCHAR(50),
      last_name       VARCHAR(50),
    );
  `

  const productsTableStmt = `
    CREATE TABLE IF NOT EXISTS products (
      id              UUID DEFAULT gen_random_uuid()  PRIMARY KEY NOT NULL,
      name            VARCHAR       NOT NULL,
      description     VARCHAR       NOT NULL,
      category        INT,
      price           DECIMAL       NOT NULL,
      FOREIGN KEY (category) REFERENCES category(id)
    );
  `
  const categoriesTableStmt = `
    CREATE TABLE IF NOT EXISTS categories (
        id             INT           PRIMARY KEY,
        name           VARCHAR,
    );
    `

  const ordersTableStmt = `
    CREATE TABLE IF NOT EXISTS orders (
      id              SERIAL          PRIMARY KEY NOT NULL,
      user_id         INT             NOT NULL,
      status          VARCHAR,
      total           DECIMAL         NOT NULL,
      created         TIMESTAMP       NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `

  const orderItemsTableStmt = `
    CREATE TABLE IF NOT EXISTS order_item (
      order_id        INT             NOT NULL,
      product_id      INT             NOT NULL,
      quantity        INT, 
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREGIN KEY (product_id) REFERENCES products(id)
    );
  `

  const cartTableStmt = `
    CREATE TABLE IF NOT EXISTS cart (
      id              SERIAL          PRIMARY KEY NOT NULL,
      user_id         INT             NOT NULL,
      total           DECIMAL         NOT NULL,
      created         TIMESTAMP       NOT NULL,
      modified        TIMESTAMP       NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `

  const cartItemTableStmt = `
    CREATE TABLE IF NOT EXISTS cart_item (
      cart_id         INT             NOT NULL,
      product_id      INT             NOT NULL,
      quantity        INT,
      FOREIGN KEY (cart_id) REFERENCES carts(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `

  try {
    const db = new Client({
      user: DB.PGUSER,
      host: DB.PGHOST,
      database: DB.PGDATABASE,
      password: DB.PGPASSWORD,
      port: DB.PGPORT
    });

    await db.connect();

    // Create tables on database
    await db.query(usersTableStmt);
    await db.query(productsTableStmt);
    await db.query(ordersTableStmt);
    await db.query(orderItemsTableStmt);
    await db.query(cartTableStmt);
    await db.query(cartItemTableStmt);
    await db.query(categoriesTableStmt)

    await db.end();

  } catch(err) {
    console.log("ERROR CREATING ONE OR MORE TABLES: ", err);
  }

})();