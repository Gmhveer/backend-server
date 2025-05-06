const SALT_VALUE = 10;

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
const EMAIL_CONFIGS = {
    service: 'gmail',
    user: process.env.MAILER_USER || 'itsmhveer@gmail.com',
    password: process.env.MAILER_PASSWORD || ""
}
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/";
const MONGO_DB = process.env.MONGO_DB || "mydatabase";
const BASEURL = process.env.BASEURL || "http://localhost:5000/";





module.exports = { SALT_VALUE, JWT_SECRET_KEY, EMAIL_CONFIGS, MONGO_URI, MONGO_DB, BASEURL };