const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let productSchema = mongoose.Schema({
    name: { type: String, require: true },
    type: { type: String, require: true },
    price: { type: Number, require: true },
    availability: { type: Boolean, default:false },
    size: { type: String, require: true,enum:['A1','A2','A3','A4','A5','A6'] },
    quantity: { type: Number, require: true, default: 0 },
    description: { type: String },
    rating: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('product', productSchema);