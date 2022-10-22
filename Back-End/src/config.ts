require("dotenv").config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT,
    dbConfig: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    }
};