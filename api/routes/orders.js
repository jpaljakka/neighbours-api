const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product')
const Order = require('../models/order')
//helper fetching all orders from this route
router.get('/', (req, res, next) => {
    Order.find()
        .select('_id firstname lastname username phone address order ')
        .populate('name')// populate here ?
        .then(docs => {
            res.status(200).jsonp({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc.id,
                        firstname: doc.firstname,
                        lastname: doc.lastname,
                        username: doc.username,
                        phone: doc.phone,
                        address: doc.address,
                        order: doc.order,
                        request: {
                            method: 'GET',
                            url: doc._id
                        }
                    }
                })

            })
        })

        .catch(err => {
            res.status(500).jsonp({
                error: new Error(err)
            });
        });
});

//order from customer side
router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .populate('name')  //ask hoang about this
        .exec()
        .then(product => {
            /* if (!product) {
                        return res.status(404).jsonp({
                            message: 'product not found'
                        })
                    }*/
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                address: req.body.address,
                phone: req.body.phone,
                order: {
                    product: req.body.product,
                    name: req.body.name,  //ask hoang
                    quantity: req.body.quantity,
                }
            });
            return order
                .save()
        })
        .then(result => {
            console.log(result)
            res.status(201).jsonp({
                message: 'Order stored to db',
                orderStored: {
                    _id: result._id,
                    firstname: result.firstname,
                    lastname: result.lastname,
                    username: result.username,
                    address: result.address,
                    phone: result.phone,
                    order: result.order
                },
                request: {
                    method: 'GET',
                    url: 'http://localhost:5000/orders/' + result._id

                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).jsonp({
                error: new Error(err)
            })
        })
})

//get specific order with order Id for helper
router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)

        .then(order => {
            if (!order) {
                return res.status(404).jsonp({
                    message: 'Orders not found'
                })
            }
            res.status(200).jsonp({
                order: order,
                request: {
                    method: 'GET',
                    url: 'localhost:5000/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).jsonp({
                message: err
            });
        });
});

// delete order from customer side
router.delete('/:orderId', (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Deleted order',
                request: {
                    method: 'POST',
                    url: 'localhost:5000/orders',
                    body: { productId: 'ID', quantity: 'Number' }
                }
            })
        })
        .catch(err => {
            res.status(500).jsonp({
                message: err
            });
        })
});
module.exports = router;