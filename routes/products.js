const Router = require('express-promise-router');
const db = require('../db');

const router = new Router();

//export router to be mounted in routes/index.js
module.exports = router;

router.get('/', async(req, res) => {
    const { rows } = await db.query('SELECT name, category FROM products');
    res.send(rows);
});

router.get('/:id', async(req, res) => {
    const { id } = req.params;
    const { rows } = await db.query('SELECT name, category FROM products WHERE id = $1', [id]);
    res.send(rows[0]);
});

router.get('/categories/:category', async(req, res) => {
    const { category } = req.params;
    const { rows } = await db.query(
        'SELECT name FROM categories WHERE id = $1 UNION SELECT name FROM products WHERE category =  $1', [category]);
    res.send(rows[0]);
});