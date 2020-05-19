const mongoose = require('mongoose');

//Schema for products to fetch from front end

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: { type: Number },
    name: { type: String, require: true }
});

module.exports = mongoose.model('Product', productSchema)