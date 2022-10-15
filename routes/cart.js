const Router = require('express-promise-router');
const db = require('../db');

const router = new Router();

//export router to be mounted in routes/index.js
module.exports = router


router.get('/', async (req, res) => {
    const { user_id } = req.body;
    const { rows } = await db.query(`
        WITH temp_table AS (
            SELECT c.*, c_i.*
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
    //for now checkout is always true
    const checkout = true;
    if (checkout) {
        const { rows } = await db.query(`INSERT INTO orders (user_id, total) SELECT cart.user_id, cart.total
                                        FROM cart WHERE cart.id = $1
                                        RETURNING *`, [cartId]);

        //Move items from cart_item to order_item with correct order id
        const { id } = rows[0];
        const update = await db.query(`INSERT INTO order_item (order_id, product_id, quantity)
                                        SELECT o.id, c_i.product_id, c_i.quantity
                                        FROM orders o, cart_item c_i
                                        WHERE o.id = $1 AND c_i.cart_id = $2`, [id, cartId]);
        
        //clears Cart and cart_item tables
        const clear = await db.query(`DELETE FROM cart WHERE cart.id = $1`, [cartId]);
    res.send(rows[0]);
    }  
});


/* use cartId routes to allow changes to cart items table associated with a specific cartId */
router.put('/:cartId', async(req, res) => {
    const { cartId } = req.params;
    const { product_id, price, quantity } = req.body;
    const insert = await db.query(`INSERT INTO cart_item VALUES ($1, $2, $3)`,
                                    [product_id, quantity, cartId]);
    //Logic for handling cart updates
    const total = price * quantity;
    const time = new Date().toISOString();
    const { rows } = await db.query(`UPDATE cart 
                                 SET total = total + $1, modified = $2
                                 WHERE id = $3 RETURNING *`, [total, time, cartId]);
    res.send(rows);
});


router.delete('/:cartId', async(req, res) => {
    const { cartId } = req.params;
    const { product_id, price, quantity } = req.body;
    const insert = await db.query('DELETE FROM cart_item WHERE cart_id = $1 AND product_id = $2', [cartId, product_id]);

    //Logic for cart updates
    const total = price * quantity;
    const time = new Date().toISOString();
    const { rows } = await db.query(`UPDATE cart 
                                    SET total = total - $1, modified = $2
                                    WHERE id = $3 RETURNING *`, [total, time, cartId]);
    res.send(rows);
});

