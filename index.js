//index for the E-commerce app project
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { PORT } = require('./config');
const mountRoutes = require('./routes/index');

const  app = express();
mountRoutes(app);

//psql session store
const store = new(require('connect-pg-simple')(session))({
    conObject,
});

app.use(session({
    store: store,
    secret: 'placeholder',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
});