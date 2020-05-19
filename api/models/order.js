const mongoose = require('mongoose');

//Schema for products to fetch from front end

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    username: { type: String, require: true },
    phone: { type: String, require: true },
    address: { type: String, require: true },
    order: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', require: true },
        quantity: { type: Number, default: 1 }
    }]
});

module.exports = mongoose.model('Order', orderSchema)