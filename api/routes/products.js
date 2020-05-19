const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const url = 'http://localhost:5000/products/'
//GET ALL PRODUCTS FROM DATABASE
router.get('/', (req, res, next) => {
    Product.find()
        .select('name _id')
        .then(docs => {
            const response = {
                count: docs.length,
                description: 'List of all products in database',
                usage: 'you can fetch each item by its id from db to use to display in',
                product: docs.map(doc => {  //map all inside docs and make new object with specific content inside
                    return {
                        name: doc.name,
                        id: doc._id,
                        request: {
                            method: 'GET',
                            url: `${url}${doc._id}`
                        }
                    }
                })
            }
            console.log(docs);
            if (docs.length >= 0) {

                res.status(200).jsonp(response)
            } else {
                res.status(201).jsonp({
                    message: 'No entries in database'
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).jsonp({
                error: err
            })
        })
});
// FIND SPECIFIC ITEM FROM DATABASE WITH ID
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)

        .then(doc => {
            console.log("get from database", doc)
            if (doc) {
                res.status(200).jsonp(doc);
            }
            else {
                res.status(404).jsonp({ message: 'invalid entry' })
            }
        })
        .catch(err => {
            console.log(new Error(err))
            res.status(500).jsonp({ error: err });
        })
});

//NEW DATABASE ENTRY
router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    product.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'NEW PRODUCT ENTRY TO DB',
                createdProduct: {
                    name: result.name,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: `url${result._id}`

                    }
                }
            });
        })
        .catch(err => {
            console.log(new Error(err))
            res.stastus(500).jsonp({
                error: err
            })
        });
});

//UPDATE PRODUCTS
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .then(result => {
            res.status(200).jsonp({
                message: 'PRODUCT UPDATE SUCCESS',
                request: {
                    type: 'GET',
                    url: `url${id}`
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).jsonp({
                error: err
            })
        })
});

//DELETE PRODUCTS BY ID
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .then(result => {
            console.log(result);
            res.status(200).jsonp({
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).jsonp({
                error: err
            })
        })
});

module.exports = router;