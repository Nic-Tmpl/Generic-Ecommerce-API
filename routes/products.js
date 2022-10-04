const Router = require('express-promise-router');
const db = require('../db');

const router = new Router();

//export router to be mounted in routes/index.js
module.exports = router;

router.get('/', async(req, res) => {
    const { rows } = await db.query('SELECT name, category FROM products');
    res.send(rows);
});

router.get('/categories', async(req, res) => {
    const { rows } = await db.query('SELECT name FROM categories');
    res.send(rows);
});

router.get('/categories/:category', async(req, res) => {
    const { category } = req.params;
    const { rows } = await db.query('SELECT c.id, c.name AS category, p.name FROM "categories" c JOIN "products" p ON c.id = p.category WHERE c.id = $1', [category]);
    res.send(rows);
});

router.get('/:id', async(req, res) => {
    const { id } = req.params;
    const { rows } = await db.query('SELECT p.*, c.name AS category FROM "products" p JOIN "categories" c ON p.category = c.id WHERE p.id = $1', [id]);
    res.send(rows[0]);
});

router.put('/:id', async(req, res) => {
    const { id } = req.params;
    const { rows } = await db.query('INSERT INTO cart_item (product_id) VALUES $1', [id]);
    res.render('/');
});

