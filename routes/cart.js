const Router = require('express-promise-router');
const db = require('../db');

const router = new Router();

//export router to be mounted in routes/index.js
module.exports = router

router.get('/:id', async(req, res) => {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM cart_item WHERE cart_id = $1', [id]);
    res.send(rows[0]);
});