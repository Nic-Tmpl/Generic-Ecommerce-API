const users = require('./users');
const cart = require('./cart');
const orders = require('./orders');
const products = require('./products');
const auth = require('./auth');

//export takes in a variable, app, which is passed in from the main index.js file.
module.exports = app => {
    app.use('/users', users);
    app.use('/cart', cart);
    app.use('/orders', orders);
    app.use('/products', products);
    app.use('/auth', auth);
};