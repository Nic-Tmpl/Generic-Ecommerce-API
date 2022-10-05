const Router = require('express-promise-router');
const db = require('../db');

const router = new Router();

//export router to be mounted in routes/index.js
module.exports = router


router.get('/', async (req, res) => {
    const { user } = req.params;
    const { rows } = await db.query(`
        WITH temp_table AS (
            SELECT c.*, c_i.product_id, c_i.quantity
            FROM "cart" c JOIN "cart_item" c_i ON c_i.cart_id = c.id
            )

        SELECT temp_table.*, products.name AS name FROM temp_table 
        JOIN products 
        ON temp_table.product_id = products.id
        WHERE temp_table.user_id = $1`, [user])
        res.send(rows);
});

router.post('/', async(req, res) => {
    const { user } = req.body.user;
    console.log(user);
    const id = user;
    const time = new Date().toISOString(); //need to figure out timestamping
    const { rows } = await db.query(`INSERT INTO cart (id, user_id, created) VALUES ($1, $2, $3)`, [id, user, time]);
    res.status(200);
    res.send(rows);
});                                                    

router.delete('/:id', async(req, res) => {
    const { id } = req.params;
    const { rows } = await db.query('DROP * FROM cart_item WHERE product_id = $1', [id]);
    res.render('/');
});