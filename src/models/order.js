const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let order = mongoose.Schema({
    productId: { type: String, ref: 'product', required: true },
    userId:{ type: String, ref: 'user', required: true },
    status: { type: Boolean,default:false },
}, { timestamps: true });
module.exports = mongoose.model('order', order);