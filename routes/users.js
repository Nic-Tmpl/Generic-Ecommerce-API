const { response } = require('express');
const Router = require('express-promise-router');
const db = require('../db');

const router = new Router();

//export the users router to be mounted in routes/index.js
module.exports = router

router.get('/:id', async(req, res) => {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    res.send(rows[0]);
});

router.put('/:id', async(req, res) => {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    const updatedProfile = Object.assign(rows[0], req.body);
    const time = new Date().toISOString();
    const update = await db.query(`UPDATE users SET 
                                    email = $1,
                                    first_name = $2,
                                    last_name = $3,
                                    modified = $4
                                    WHERE id = $5`, 
            [updatedProfile.email, updatedProfile.first_name, updatedProfile.last_name, time, id]);
    res.send(update);
})

router.delete('/:id', async(req, res) => {
    const { id } = req.params;
    const { rows } = await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.send(rows);
})