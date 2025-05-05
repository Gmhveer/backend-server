const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: {
        street: { type: String, required: true },
        city:    { type: String, required: true },
        state:   { type: String, required: true },
        zip:     { type: String, required: true },
        country: { type: String, required: true },
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String }, // for email/phone verification flow
    profileImage: { type: String }, // optional
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] }
}, { timestamps: true });
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('user', userSchema);