const product = require('../models/product');
const userModel = require('../models/user');
const { ResponseHandler, ResponseObject } = require('../helper/responeHandler');
const { SALT_VALUE, JWT_SECRET_KEY } = require('../configs/utlis');
const { isEmpty } = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { BASEURL } = require('../configs/utlis')
const { sendMail } = require('../services/emailService');
const { REGISTRATION, LOGIN_INFO } = require('../services/emailEnums');
const register = async (req, res) => {
    const response = { ...ResponseObject }; // clone responseObject
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        const { name, email, password, phone, address, dateOfBirth, gender } = req.body;

        // Basic input validation (can be enhanced)
        if (!name || !email || !password || !phone || !address || !address.city || !address.state || !address.zip || !address.country) {
            response.code = 400;
            response.message = "Missing required fields";
            return ResponseHandler("Missing fields", response, res);
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
            dateOfBirth: new Date(),
            gender,
            role: 'user',
            isVerified: false,
            verificationToken: Math.floor(Math.random() * 1000000) + 1,
        };

        const result = await userModel.create(newUser);
        try {
            await sendMail(email, REGISTRATION, {
                name: result.name,
                email: result.email,
                time: (new Date().toString()),
                location: `${result.address.city}, ${result.address.state}, ${result.address.country}`,
                verificationLink: `${BASEURL}user/verify-email?token=${result.verificationToken}`,
                ip: ip
            })

        } catch (error) {
            console.log('error', error);

        }
        response.code = 200;
        response.message = "User created successfully";
        response.data = result;
        return ResponseHandler(null, response, res);

    } catch (err) {
        response.code = 500;
        response.message = "Failed to create new user";
        return ResponseHandler(err.message, response, res);
    }
};

const login = async (req, res) => {
    const response = { ...ResponseObject }; // clone responseObject
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;


    if (isEmpty(req.body.email) || isEmpty(req.body.password)) {
        response.code = 401;
        response.message = "Invalid Inputs email || password";
        return ResponseHandler(response.message, response, res);
    }

    userModel.findOne({ email: req.body.email }).then(async result => {

        if (isEmpty(result)) {
            response.code = 404;
            response.message = 'user not found';
            return ResponseHandler(err, response, res);
        }
        const isMatch = await bcrypt.compare(req.body.password, result.password);

        if (!isMatch) {
            response.code = 401;
            response.message = "Invalid password";
            return ResponseHandler("Invalid password", response, res);
        }
        try {
            sendMail(result.email, LOGIN_INFO, {
                name: result.name,
                email: result.email,
                time: (new Date().toString()),
                location: `${result.address.city}, ${result.address.state}, ${result.address.country}`,
                ip: ip
            })
        } catch (error) {
            console.log('error', error);

        }
        const token = jwt.sign({ userId: result._id, role: result.role }, JWT_SECRET_KEY, { expiresIn: '1h' });
        response.message = "User logged in successfully";
        response.data = [{ userId: result._id, accessToken: token, role: result.role }];
        return ResponseHandler(null, response, res);

    }).catch(err => {
        response.code = 404;
        response.message = 'User login failed';
        return ResponseHandler(err, response, res);
    });

}

const verifyEmail = async (req, res) => {
    // const response = { ...ResponseObject }; // clone responseObject
    const { token } = req.query; // or req.body, depending on your frontend

    if (!token) {
        return res.render('verify', { status: 'fail' });
        // response.code = 400;
        // response.message = "Verification token is required";
        // return ResponseHandler("Missing token", response, res);
    }

    try {
        const user = await userModel.findOne({ verificationToken: token });

        if (!user) {
            return res.render('verify', { status: 'fail' });
            // response.code = 404;
            // response.message = "Invalid or expired verification token";
            // return ResponseHandler("User not found", response, res);
        }

        user.isVerified = true;
        user.verificationToken = undefined; // or null
        await user.save();

        return res.render('verify', { status: 'success' });
        // response.code = 200;
        // response.message = "Email verified successfully";
        // response.data = { email: user.email, isVerified: isVerified ? true : false };
        // return ResponseHandler(null, response, res);

    } catch (err) {
        res.render('verify', { status: 'fail' });
        // response.code = 500;
        // response.message = "Verification failed";
        // return ResponseHandler(err.message, response, res);
    }
};
module.exports = { register, login, verifyEmail };