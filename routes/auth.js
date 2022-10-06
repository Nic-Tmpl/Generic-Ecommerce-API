const Router = require('express-promise-router');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
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

router.post('/signup', async(req ,res) => {
    //insert bcrypt here
        const { email, password } = req.body;
        const passwordHash = async (password, saltRounds) => {
            try {
                const salt = await bcrypt.genSalt(saltRounds);
                return await bcrypt.hash(password, salt);
            } catch (err) {
                console.log(err);
            }

            return null;
        };
       const newUser = await db.query('INSERT INTO users (email, password, salt) VALUES ($1, $2, $3)',
        [email, passwordHash], (err) => {
            if (newUser) {
                res.status(201).json({
                    msg: "Succesfully Registered!"
                })
            }                                          
            req.login(user, (err) => {
                if (err) { return next(err); }
                res.redirect('/');
            });
        });
    });