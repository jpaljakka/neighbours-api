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
                message: 'NEW CATEGORY',
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

module.exports = router;