const Router = require('express-promise-router');
const db = require('../db');

const router = new Router();

//export router to be mounted in routes/index.js
module.exports = router


router.get('/', async (req, res) => {
    const { user_id } = req.body;
    const { rows } = await db.query(`
        WITH temp_table AS (
            SELECT c.*, c_i.product_id, c_i.quantity
            FROM "cart" c JOIN "cart_item" c_i ON c_i.cart_id = c.id
            )

        SELECT temp_table.*, products.name AS name FROM temp_table 
        JOIN products 
        ON temp_table.product_id = products.id
        WHERE temp_table.user_id = $1`, [user_id])
        res.send(rows);
});

router.post('/', async(req, res) => {
    const { user_id } = req.body;
    const time = new Date().toISOString();
    const { rows } = await db.query(`INSERT INTO cart (user_id, created) VALUES ($1, $2)`, [user_id, time]);
    res.status(200);
    res.send(rows);
});

router.delete('/', async(req, res) => {
    const { user_id } = req.body;
    const { rows } = await db.query(`DELETE FROM cart WHERE user_id = $1`, [user_id]);
    res.status(200);
    res.send('Cart Removed.');
});


router.post('/:cartId/checkout', async(req, res) => {
    const { cartId } = req.params;
    const checkout = true;
    if (checkout) {
        const { rows } = await db.query(`INSERT INTO order(user_id, total) SELECT (user_id, total) FROM cart WHERE id = $1;
                                        INSERT INTO order_item(cart_id, product_id, quantity) 
                                        SELECT (cart_id, product_id, quantity)
                                        FROM cart_item WHERE cart_id = $1`, [cartId]);
    res.send(rows[0]);
    }
   
})


/* use cartId routes to allow changes to cart items table associated with a specific cartId */
router.put('/:cartId', async(req, res) => {
    const { cartId } = req.params;
    const { product_id, price, quantity } = req.body;
    const { rows } = await db.query(`INSERT INTO cart_item VALUES ($1, $2, $3)`,
                                    [cartId, product_id, quantity]);
    //Logic for handling cart updates
    const total = price * quantity;
    const time = new Date().toISOString();
    console.log(total);
    const insert = await db.query(`UPDATE cart 
                                 SET total = total + $1, modified = $2
                                 WHERE id = $3`, [total, time, cartId]);
    res.send(insert);
});


router.delete('/:cartId', async(req, res) => {
    const { cartId } = req.params;
    const { product_id, price, quantity } = req.body;
    const { rows } = await db.query('DELETE FROM cart_item WHERE cart_id = $1 AND product_id = $2', [cartId, product_id]);

    //Logic for cart updates
    const total = price * quantity;
    const time = new Date().toISOString();
    const insert = await db.query(`UPDATE cart 
                                    SET total = total - $1, modified = $2
                                    WHERE id = $3`, [total, time, cartId]);
    res.send(rows);
});

