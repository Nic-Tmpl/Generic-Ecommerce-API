const Router = require('express-promise-router');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../db');

const comparePasswords = async(password, hash) => {
    try {
        const matchFound = await bcrypt.compare(password, hash);
        return matchFound;
    } catch (err) {
        console.log(err);
    }
    return false;
};

passport.use(new LocalStrategy(
    async (email, password, done) => {
    try {
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            if(rows.email = null) {
                return done(null, false, {message: `No user by that email`});
            }
    } catch (e) {
        return done(e);
    }
    let match = await comparePasswords(password, rows.password);
    if (!match) {
        return done(null,false, {message: 'Not a matching password'});
    }
        
    return done(null, row);
    }
));

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
    successRedirect: '/',
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
        const { email, password } = req.body;
        try {
        const { rows } = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        }
        catch (e) {
            return(e)
        };
        
            const salt = await bcrypt.genSalt(10); //should be env variable?
            const hashedPassword =  await bcrypt.hash(password, salt);
            const newUser = await db.query('INSERT INTO users (email, password) VALUES ($1, $2)',
            [email, hashedPassword]);
            if (newUser) {
            res.status(201).json({
                msg: "Succesfully Registered!"
             })
            res.redirect('/');                                        
            }
        } else {
            res.redirect('/login');
        }
});