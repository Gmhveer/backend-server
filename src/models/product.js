const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let product = mongoose.Schema({
    name: { type: String, require: true },
    type: { type: String, require:true },
    price: { type: Number, require: true },
    description: { type: String },
    rating: { type: Number,default:0 }
}, { timestamps: true });
module.exports = mongoose.model('product', product);