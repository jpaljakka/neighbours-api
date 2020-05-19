require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan');
const productRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')
const bodyParse = require('body-parser');
const mongoose = require('mongoose');

app.use(morgan('dev'));
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT')
        return res.status(200).jsonp({})
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);

const uri = 'mongodb+srv://' + process.env.DBUSR + ':' + process.env.DBPW + '@neighbors-api-b2sdo.mongodb.net/neighbors?retryWrites=true&w=majority'

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

//Error check
db.on("error", (err) => {
    console.log(`DATABASE ERROR:${err}`);
});

//Connection check
db.on("open", () => {
    console.log(`DATABASE OK`);
});

app.use((req, res, next) => {
    const error = new Error('BAD REQUEST')
    error.status = 404;
    next(error);

})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.jsonp({
        error: {
            message: error.message
        }
    })
});
module.exports = app;