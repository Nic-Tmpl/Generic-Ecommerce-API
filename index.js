//index for the E-commerce app project
const express = require('express');
const { PORT } = require('./config');
const mountRoutes = require('./routes/index');

const  app = express();
mountRoutes(app);

app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
});