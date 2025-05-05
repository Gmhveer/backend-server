const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let store = mongoose.Schema({
    name: { type: String },
    session_id: { type: String, require: true},
}, { timestamps: true });
module.exports = mongoose.model('store', store);