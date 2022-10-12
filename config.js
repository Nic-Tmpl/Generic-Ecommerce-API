require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    SECRET: process.env.SECRET,
    
    DB: {
        PGHOST: process.env.PGHOST,
        PGUSER: process.env.PGUSER,
        PGDATABASE: process.env.PGDATABASE,
        PGPASSWORD: process.env.PGPASSWORD,
        PGPORT: process.env.PGPORT
    },
};