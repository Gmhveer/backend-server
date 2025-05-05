const SALT_VALUE = 10;
const JWT_SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
const EMAIL_CONFIGS={
    service:'gmail',
    user:'itsmhveer@gmail.com',
    password:""
}
module.exports = { SALT_VALUE,JWT_SECRET_KEY,EMAIL_CONFIGS }