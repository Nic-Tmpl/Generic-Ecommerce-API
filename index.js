//index for the E-commerce app project
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');
const db = require('./db');
const { PORT } = require('./config');
const mountRoutes = require('./routes/index');

const  app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//psql session store
const store = new pgSession({
    pool: db,
});

app.use(session({
    store: store,
    secret: 'placeholder',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } //30 days
}));

app.use(passport.authenticate('session'));

//brings in routers
mountRoutes(app);



app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
});