const Router = require('express-promise-router');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const db = require('../db');

passport.use(new LocalStrategy((email, password, cb) => {
   db.query('SELECT * FROM users WHERE email = $1', [email], (err, row) => {
        if (err) {return cb(err); }
        if (!row) {return cb(null, false, { message: 'Incorrect email or password.'}); }

        //if a user is returned correctly
        crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) { return cb(err); }
            if (!crypto.timingSafeEqual(row.hashedPassword, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect email or password.'});
            }

            return cb(null, row);
        });
    });
}));

passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        cb(null, { id: user.id, email: user.email });
    });
});

passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    });
});

const router = new Router();

//export router for use in routes/index
module.exports = router;

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/login/password', passport.authenticate('local', {
    succesRedirect: '/',
    failureRedirect: '/login'
}));

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.post('/signup', (req ,res, next) => {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) { return next(err); }
        db.query('INSERT INTO users (email, password, salt) VALUES $1, $2, $3',
        [req.body.email, hashedPassword, salt], (err) => {
            if (err) { return next(err); }
            const user = {
                id: this.lastID,
                username: req.body.username
            };
            req.login(user, (err) => {
                if (err) { return next(err); }
                res.redirect('/');
            });
        });
    });
});