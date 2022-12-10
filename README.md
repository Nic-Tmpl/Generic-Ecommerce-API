# Generic-E-commerce-API

A basic API for handling E-commerce operations, built as a portfolio project of the Codecademy Full-Stack Engineer course. Currently there are five main routers: Auth, Cart, Orders, Products, and Users. It was built as a standalone, and is implemented curretly in my Hidalgo full-stack app. There are a number of revisions incorporated in that app that will be folded into this app.

To run the app and build the database, there is a database-setup.js file. An Example .env file is below.

 ### Features
1. CRUD ability for products, users, and shopping cart.
2. User signup/account management/login authentication.
3. Shopping Cart handled in backend in this implementation, but can also be handled client-side.
4. User authentication and password hashing by Passport and bcrypt.

## Tech Stack
+ [Node](https://nodejs.org/en/)/[Express](https://expressjs.com/) for backend.
+ [Express-Promise-Router](https://www.npmjs.com/package/express-promise-router) for modern Async/Await calls in express routes.
+ [Express-Session](https://www.npmjs.com/package/express-session)/[Passport](https://www.passportjs.org/)/[bcrypt](https://www.npmjs.com/package/bcrypt) for user authentication.
+ [PostGreSQL](https://www.postgresql.org/) for database.
+ [node postgres](https://node-postgres.com/) to connect database to backend.
+ [dotenv](https://www.npmjs.com/package/dotenv) for environment variables.

### EXAMPLE .ENV
#SERVER CONFIG
PORT= - an integer you like

#SESSION CONFIG
SECRET= secret

#DB CONFIG
PGHOST= host
PGUSER= user
PGDATABASE= relevant database
PGPASSWORD= yourpassword
PGPORT= another integer

### Repo
https://github.com/Nic-Tmpl/Generic-Ecommerce-API


### Upcoming Revisions
Currently this app is still under construction.
