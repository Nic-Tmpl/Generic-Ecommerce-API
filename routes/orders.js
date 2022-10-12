const Router = require('express-promise-router');
const db = require('../db');

const router = new Router();

//export router to be mounted in routes/index.js
module.exports = router;

router.get('/', async(req, res) => {
    const { user_id } = req.body;
    const { rows } = await db.query(`SELECT * FROM orders WHERE user_id = $1`, [user_id]);
    res.send(rows);
});

router.get('/:orderId', async(req, res) => {
    const {orderId }  = req.params
    const { user_id } = req.body;
    const { rows } = await db.query(`SELECT * FROM orders WHERE id = $1 and user_id = $2`, [user_id]);
});