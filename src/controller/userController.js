const product = require('../models/product');
const userModel = require('../models/user');
const { ResponseHandler, ResponseObject } = require('../helper/responeHandler');
const { SALT_VALUE } = require('../helper/utlis');
const { isEmpty } = require('lodash');
const bcrypt = require('bcrypt');
const { sendMail } = require('../helper/emailService');
const { REGISTRATION } = require('../helper/emailEnums');
const register = async (req, res) => {
    try {
        const { name, email, password, phone, address, dateOfBirth, gender } = req.body;

        // Basic input validation (can be enhanced)
        if (!name || !email || !password || !phone || !address || !address.street || !address.city || !address.state || !address.zip || !address.country) {
            ResponseObject.code = 400;
            ResponseObject.message = "Missing required fields";
            return ResponseHandler("Missing fields", ResponseObject, res);
        }

        // Check for existing user
        const existingUser = await userModel.findOne({ email });
        let finalEmail = email;
        let finalName = name;

        if (existingUser) {
            const randomNumber = Math.floor(Math.random() * 1000000) + 1;
            finalName = `${name}${randomNumber}`;
            const emailParts = email.split('@');
            finalEmail = `${emailParts[0]}${randomNumber}@${emailParts[1]}`;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_VALUE);

        // Create user object
        const newUser = {
            name: finalName,
            email: finalEmail,
            password: hashedPassword,
            phone,
            address,
            dateOfBirth,
            gender,
            role: 'user',
            isVerified: false,
            verificationToken: crypto.randomBytes(20).toString('hex'),
        };

        const result = await userModel.create(newUser);
        await sendMail(email, REGISTRATION.subject, {
            name: name,
            time: (new Date().toString()),
            location: address.toString,
            ip: '192.168.1.1'
        })
        ResponseObject.code = 200;
        ResponseObject.message = "User created successfully";
        ResponseObject.data = result;
        return ResponseHandler(null, ResponseObject, res);

    } catch (err) {
        ResponseObject.code = 500;
        ResponseObject.message = "Failed to create new user";
        return ResponseHandler(err.message, ResponseObject, res);
    }
};

const login = async (req, res) => {
    if (isEmpty(req.body.email) || isEmpty(req.body.password)) {
        ResponseObject.code = 401;
        ResponseObject.message = "Invalid Inputs email || password";
        return ResponseHandler(ResponseObject.message, ResponseObject, res);
    }

    userModel.findOne({ email: req.body.email, password: req.body.password }).then(async result => {
        if (isEmpty(result)) {
            ResponseObject.code = 404;
            ResponseObject.message = 'user not found';
            return ResponseHandler(err, ResponseObject, res);
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            ResponseObject.code = 401;
            ResponseObject.message = "Invalid password";
            return ResponseHandler("Invalid password", ResponseObject, res);
        }
        ResponseObject.message = "User found successfully";
        ResponseObject.data = result;
        return ResponseHandler(null, ResponseObject, res);

    }).catch(err => {
        ResponseObject.code = 404;
        ResponseObject.message = 'user not found';
        return ResponseHandler(err, ResponseObject, res);
    });

}

const verifyEmail = async (req, res) => {
    const { token } = req.query; // or req.body, depending on your frontend

    if (!token) {
        ResponseObject.code = 400;
        ResponseObject.message = "Verification token is required";
        return ResponseHandler("Missing token", ResponseObject, res);
    }

    try {
        const user = await userModel.findOne({ verificationToken: token });

        if (!user) {
            ResponseObject.code = 404;
            ResponseObject.message = "Invalid or expired verification token";
            return ResponseHandler("User not found", ResponseObject, res);
        }

        user.isVerified = true;
        user.verificationToken = undefined; // or null
        await user.save();

        ResponseObject.code = 200;
        ResponseObject.message = "Email verified successfully";
        ResponseObject.data = { email: user.email, isVerified: isVerified ? true : false };
        return ResponseHandler(null, ResponseObject, res);

    } catch (err) {
        ResponseObject.code = 500;
        ResponseObject.message = "Verification failed";
        return ResponseHandler(err.message, ResponseObject, res);
    }
};
module.exports = { register, login, verifyEmail };