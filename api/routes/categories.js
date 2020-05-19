const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Categories = require('../models/categories')


router.post('/entry', (req, res, next) => {
    const category = new Categories({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    category.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'new category',
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


router.get('/categories', (req, res, next) => {
    Categories.find()
        .select('name _id')
        .then(docs => {
            const response = {
                count: docs.length,
                category: docs.map(doc => {  //map all inside docs and make new object with specific content inside
                    return {
                        name: doc.name,
                        id: doc._id,
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

module.exports = router;