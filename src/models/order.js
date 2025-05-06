const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let orderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1, min: 1 }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    address: { type: String, required: true },
    paymentMethod: { type: String, enum: ['cod', 'card'], default: 'cod' }

}, { timestamps: true });
module.exports = mongoose.model('order', orderSchema);